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

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/get_items", (req, res) => {
    // pull list items from server
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect((err) => {
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
    client.close();
});

app.post("/add_item", (req, res) => {
    //insert item into database
    const list_item = req.body;
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect((err) => {
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
    client.close();
});
app.post("/delete_item", (req, res) => {
    //insert item into database
    const delete_id = req.body._id;
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect((err) => {
        const collection = client.db("test").collection("list-items");
        try {
            collection.deleteOne({ _id: new mongodb.ObjectID(delete_id) });
            console.log(`Deleted ${delete_id}`);
        } catch (error) {
            throw error;
        }
    });
    client.close();
});

app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
});
