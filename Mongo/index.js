const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const db = 'db';

//ad to mongodb specific collection
MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    var dbo = client.db(db);
    var myobj = { PlateNr: "IH786P0J", ePasts: "ilmars.geiba@gmail.com" };
    dbo.collection("epasti").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        client.close();
    });
});