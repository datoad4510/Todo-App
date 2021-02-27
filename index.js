const express = require("express");
const app = express();
const port = 3000;

const MongoClient = require("mongodb").MongoClient;
const url =
	"mongodb+srv://dato:irakli58@cluster0.m8xlq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/", (req, res) => {
	const list_item = JSON.parse(req);

	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		const dbo = db.db("mydb");
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
