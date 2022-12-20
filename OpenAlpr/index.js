const exec = require('child_process').exec;
const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');
const Minio = require('minio')
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_URL,
    port: 9000,
    useSSL: false
});
const RabbitMQ_URI = process.env.AMQP_URL
const Mongo_URI = process.env.MONGO_URL;
const db = 'db';

const transporter = nodemailer.createTransport({
    host: "mail.mail.ee",
    port: 587,
    secure: false,
    auth: {
        user: 'cloudparking@mail.ee',
        pass: 'WRa?H3v1rJ'
    }
});

amqp.connect(RabbitMQ_URI, function(err, connection) {
    if (err) throw err;

    connection.createChannel(function(err, channel) {
        if (err) throw err;

        let queue = 'my-queue';
        channel.assertQueue(queue, {
            durable: true
        });
        console.log("Gaida ziņu", queue);
        channel.consume(queue,
            function (msg) {
                console.log("Ziņa saņemta: ", msg.content.toString());
                let AutoDati = JSON.parse(msg.content);
                console.log("Faila nosaukums ir " + AutoDati.imageName);

                minioClient.fGetObject('cars', AutoDati.imageName, './img/' + AutoDati.imageName, function(err) {
                    if (err) throw err;
                    console.log('Bilde lejupielādēta')
                })

                let command = "openalpr -c eu ./img/" + AutoDati.imageName;
                exec(command,
                    function (error, stdout, stderr) {
                    if (error) throw error;
                    if (stderr) throw stderr;
                        let RegEx = new RegExp("- ([A-Z0-9]+)", "i");
                        let PlateNr = stdout.match(RegEx)[1];
                        console.log("Plate number: " + PlateNr);

                        MongoClient.connect(Mongo_URI, function(err, client) {
                            if (err) throw err;
                            var dbo = client.db(db);
                            var query = { PlateNr: PlateNr };
                            dbo.collection("autostavvieta").find(query).toArray(function(err, result) {
                                if (err) throw err;
                                console.log(result);
                                if (result.length > 0) {
                                    console.log("Auto ar šādu numuru ir reģistrēts");
                                    let dateOld = result[0].date;
                                    console.log("Pirmās Reģistrācijas datums: " + dateOld);

                                    let hours = Math.abs(new Date(AutoDati.date) - new Date(dateOld)) / 36e5;
                                    console.log("Stundas starp reģistrācijām: " + hours);

                                    dbo.collection("epasti").find(query).toArray(function(err, result) {
                                        if (err) throw err;
                                        if (result.length > 0) {
                                            console.log(result)
                                            var mailOptions = {
                                                from: 'cloudparking@mail.ee',
                                                to: result[0].ePasts,
                                                subject: 'Stāvvietas patēriņš',
                                                text: 'Jūs nostāvējāt stāvvietā ' + hours + ' stundas'
                                            };
                                            transporter.sendMail(mailOptions, function(err, info){
                                                if (err) throw err;
                                                else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });
                                        }
                                    });

                                    dbo.collection("autostavvieta").deleteOne(query, function(err, obj) {
                                        if (err) throw err;
                                        console.log("1 document deleted");
                                    });
                                }

                                else {
                                    console.log("Auto nav reģistrēts");

                                    var myobj = { PlateNr: PlateNr, date: AutoDati.date };
                                    dbo.collection("autostavvieta").insertOne(myobj, function(err, res) {
                                        if (err) throw err;
                                        console.log("1 document inserted");
                                        client.close();
                                    });
                                }
                            });
                        });
                    });
            },
            {
                noAck: true
            }
        );
    });
});