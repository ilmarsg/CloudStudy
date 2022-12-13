var express = require('express');
var app = express();
var fs = require("fs");
var CSVToJSON = require('csvtojson')
app.get('/getData/make/:make/engine/:engine', function (req, res) {
    fs.readFile( __dirname + "/" + "data.txt", 'utf8', function (err, data) {
        //convert csv to json
        CSVToJSON().fromString(data).then(function(jsonArrayObj){
            //return json with pretty print
            res.end(JSON.stringify(jsonArrayObj, null, 4));
        });
    });
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Lietotne ieslēgta un klausās: http://%s:%s", host, port)
})