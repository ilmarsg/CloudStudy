const express = require('express');
const app = express();
const fs = require("fs");
const {parse} = require("csv-parse/sync");
const csv = require("csv-parser");

app.get('/getData/make/:make/engine/:engine', function (req, res) {
    const regex = new RegExp(".*" + req.params.make + ".*" + req.params.engine + ".*", "gi");
    const results = [];
    fs.createReadStream(__dirname + "/" + "data.txt")
        .pipe(csv({separator: ";", filter: (line) => regex.test(line)}))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.end(JSON.stringify(results));
        });
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Lietotne ieslēgta un klausās: http://%s:%s", host, port)
})