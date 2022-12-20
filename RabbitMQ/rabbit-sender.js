var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost:5672', function(error0, connection) {
    if (error0) { throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'my-queue'; var data = {"date": "2022-12-19T11:45:43.511Z", "imageName": "bilde.jpg",};
        var msg = JSON.stringify(data);
        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
});