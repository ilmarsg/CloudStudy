const express = require('express')
const app = express()
const port = 3001
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');


var Minio = require('minio')
var minioClient = new Minio.Client({
    endPoint: process.env.MINIO_URL,
    port: 9000,
    useSSL: false
});

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.post('/', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: "req"
            });
        } else {
            let image = req.files.image;

            // SEND TO RABBIT MQ
            amqp.connect(process.env.AMQP_URL, function(err, connection) {
                if (err) throw err;
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    var currenttime = new Date();
                    var queue = 'my-queue';
                    var data = {
                        "date": currenttime,
                        "imageName": image.name,
                    };
                    var msg = JSON.stringify(data);
                    channel.assertQueue(queue, { durable: true });
                    channel.sendToQueue(queue, Buffer.from(msg));
                    console.log(" [x] Sent %s", msg);
                });
            });

            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            image.mv('./' + image.name);

            minioClient.makeBucket('cars', function (err) {
                if (err)
                    console.log(err)
                console.log('Bucket created successfully')
                var filePath = "./" + image.name;
                // Using fPutObject API upload your file to the bucket europetrip.
                minioClient.fPutObject('cars', image.name, filePath, function (err, etag) {
                    if (err)
                        return console.log(err)
                    console.log('File uploaded successfully.')
                });
            })

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: image.name,
                    mimetype: image.mimetype,
                    size: image.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))