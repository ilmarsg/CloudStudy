const fs = require("fs");
const exec = require('child_process').exec;
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://192.168.1.106:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        let queue = 'my-queue';
        channel.assertQueue(queue, {
            durable: true
        });
        console.log("Gaida ziņu", queue);
        channel.consume(queue, function(msg) {
            console.log("Ziņa saņemta: ", msg.content.toString());
            let AutoDati = JSON.parse(msg.content);
            console.log("Faila nosaukums ir " +AutoDati.Filename);
            //Ievietot faila pieprasīšanu no minio
            let command = "docker run --rm -v $(pwd):/data:ro openalpr -c eu " + AutoDati.Filename;
            exec(command,
                function (error, stdout, stderr) {
                let RegEx = new RegExp("- ([A-Z0-9]+)", "i");
                let PlateNr = stdout.match(RegEx)[1];
                console.log("Plate number: " + PlateNr);

            });
            If (AutoDati.LaiksLidz) != "" {
                //Papildināt datubāzi ar gala laiku, balstoties uz numura zīmi
                //Izrēķināt pavadīto laiku
                //Nosūtīt klientam e-pastu ar pavadīto ilgumu, ja ir pieejams datubāzē e-pasts
            }
            else {
                //Papildināt datubāzi ar sākuma laiku, balstoties uz numura zīmi
            }
            }, {
            noAck: true
        });
    });
});