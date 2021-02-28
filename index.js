const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const url =
	"mongodb+srv://dato:Irakli58@cluster0.m8xlq.mongodb.net/test?retryWrites=true&w=majority";

app.get("/", (req, res) => {
	// pull list items from server
	res.send("Hello World!");
});

app.post("/", (req, res) => {
	//insert item into database
	const list_item = req;
	console.log(list_item);
	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	client.connect((err) => {
		const collection = client.db("test").collection("list-items");
		try {
			collection.insertOne(list_item);
		} catch (error) {
			throw errror;
		}
	});
	client.close();
	res.send(`Got a new list item ${list_item.data}`);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
