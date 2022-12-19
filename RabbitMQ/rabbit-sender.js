var amqp = require('amqplib/callback_api');
amqp.connect('amqp://192.168.1.106:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'my-queue'; var data = {"LaiksNo": "21:00","LaiksLidz": "", "Filename": "h786poj.jpg",};
        var msg = JSON.stringify(data);
        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
});
