window.addEventListener("load", async (event) => {
	document.getElementById("form").addEventListener("submit", (event) => {
		event.preventDefault();
		let node = document.createElement("li");
		node.innerText = document.getElementById("text-input").value;
		document.getElementById("todo-list").appendChild(node);

		// send list item to server so it can put it into mongodb
		const data = { data: node.innerText };

		fetch("http://localhost:3000", {
			method: "POST", // or 'PUT'
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
});
