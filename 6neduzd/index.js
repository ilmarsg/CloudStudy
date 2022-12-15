const express = require('express');
const app = express();
const fs = require("fs");
const {parse} = require("csv-parse");

app.get("/getData/make/:make/engine/:engine", function (req, res) {
    let result = [];
    fs.createReadStream(__dirname + "/" + "ta2017c.lst")
        .pipe(parse({delimiter: ";", from_line: 2, relax_column_count: true}))
        .on("data", function (row) {
            let NormMake = req.params["make"].normalize("NFD").replace(/\p{Diacritic}/gu, "");
            let NormEngine = req.params["engine"].normalize("NFD").replace(/\p{Diacritic}/gu, "");
            let RegExMake = new RegExp(NormMake, "i");
            let RegExEngine = new RegExp(NormEngine, "i");
            let NormRow1 = "";
            let NormRow2 = "";
            if (row[1] != null) {
                NormRow1 = row[1].normalize("NFD").replace(/\p{Diacritic}/gu, "");
            }
            if (row[2] != null) {
                NormRow2 = row[2].normalize("NFD").replace(/\p{Diacritic}/gu, "");
            }
            if (RegExMake.test(NormRow1) && RegExEngine.test(NormRow2)) {
                var entry = {
                    "date": row[0],
                    "car": row[1],
                }
                result.push(entry);
            }
        })
        .on("end", () => {
            res.end(("{ \"results\": " + JSON.stringify(result) + ", \"count\": " + result.length + " }"));
        })
        .on("error", (err) => {
            res.end("Kļūda: " + err);
        })
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Tīmekļa pakalpe ir ieslēgta un klausās adresē: http://%s:%s", host, port)
})