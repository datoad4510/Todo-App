const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const url =
	"mongodb+srv://dato:Irakli58@cluster0.m8xlq.mongodb.net/test?authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.get("/", (req, res) => {
	// pull list items from server
	res.send("Hello World!");
});

app.post("/", (req, res) => {
	//insert item into database
	const list_item = req;

	// client.connect((err) => {
	// 	if (err) throw err;
	// 	const collection = client.db("test").collection("list-items");
	// 	// perform actions on the collection object
	// 	client.close();
	// });

	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		const dbo = db.db("test");
		const obj = {
			data: node.innerText,
		};
		dbo.collection("list-items").insertOne(obj, function (err, res) {
			if (err) throw err;
			console.log(`1 document inserted ${list_item.data}`);
			db.close();
		});
	});

	res.send(`Got a new list item ${list_item.data}`);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
