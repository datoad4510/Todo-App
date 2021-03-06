const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(cors());
app.use(bodyParser.json());

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url =
    "mongodb+srv://dato:Irakli58@cluster0.m8xlq.mongodb.net/test?retryWrites=true&w=majority";
// mongodb+srv://dato:<password>@cluster0.m8xlq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
    console.log("Connected to database!");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/get_items", (req, res) => {
    // pull list items from server

    // get/find all documents in collection
    client
        .db("test")
        .collection("list-items")
        .find()
        .toArray((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send({ collection: result });
            }
        });
});

app.post("/add_item", (req, res) => {
    //insert item into database
    const list_item = req.body;

    const collection = client.db("test").collection("list-items");
    try {
        collection.insertOne(list_item).then((data) => {
            res.send(data.insertedId);
        });
        console.log(`Inserted ${list_item.data}`);
    } catch (error) {
        throw error;
    }
});

app.post("/delete_item", (req, res) => {
    //insert item into database
    const delete_id = req.body._id;

    const collection = client.db("test").collection("list-items");
    try {
        // zedmeti "" aqvs garshemo axlad damatebul delete_id-s
        collection
            .deleteOne({ _id: new mongodb.ObjectID(delete_id) })
            .then((result) => res.send({ deletedCount: result.deletedCount }));
        console.log(`Deleted ${delete_id}`);
    } catch (error) {
        throw error;
    }
});

app.post("/update_item", (req, res) => {
    //insert item into database
    const update_id = req.body._id;
    delete req.body["_id"];

    const collection = client.db("test").collection("list-items");
    try {
        // update document that has id == delete_id
        // with req.body
        collection
            .updateOne(
                { _id: new mongodb.ObjectID(update_id) },
                { $set: req.body }
            )
            .then((result) =>
                res.send({ modifiedCount: result.modifiedCount })
            );
        console.log(`Updated ${update_id}`);
    } catch (error) {
        throw error;
    }
});

app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
});
