window.addEventListener("load", (event) => {
	document.getElementById("form").addEventListener("submit", (event) => {
		event.preventDefault();
		let node = document.createElement("li");
		node.innerText = document.getElementById("text-input").value;
		document.getElementById("todo-list").appendChild(node);
	});
});
