const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "Scripts")));

// app.use(function (req, res, next) {
//     res.header(
//         "Access-Control-Allow-Origin",
//         "https://datoad4510.github.io/Todo-App/"
//     ); // update to match the domain you will make the request from
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const url =
    "mongodb+srv://dato:Irakli58@cluster0.m8xlq.mongodb.net/test?retryWrites=true&w=majority";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
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
            collection.insertOne(list_item);
            console.log(`Inserted ${list_item.data}`);
        } catch (error) {
            throw error;
        }
    });
    client.close();
    res.send(`Got a new list item ${list_item.data}`);
});

app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
});
