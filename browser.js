async function getList() {
    const list = await fetch("http://localhost:3000/get_items")
        .then((res) => res.json())
        .then((res) => res.collection)
        .catch((err) => console.log(err));
    list.forEach((element) => {
        let node = document.createElement("li");
        node.innerText = element.data;
        document.getElementById("todo-list").appendChild(node);
    });
}

window.addEventListener("load", async (event) => {
    // get entire list from database
    await getList();

    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        let node = document.createElement("li");
        node.innerText = document.getElementById("text-input").value;
        document.getElementById("todo-list").appendChild(node);

        document.getElementById("text-input").value = "";
        // send list item to server so it can put it into mongodb
        const data = { data: node.innerText };

        fetch("http://localhost:3000/add_item", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.text())
            .then((text) => {
                console.log(`${text}`);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
});
