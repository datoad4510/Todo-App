const server = "https://my-todo-app-2344wqs.herokuapp.com";
// const server = "http://localhost:3000";

async function fetchList() {
    // get all todos from server
    return fetch(`${server}/get_items`)
        .then((res) => res.json())
        .then((res) => res.collection)
        .catch((err) => console.log(err));
}

async function putList() {
    const list = await fetchList();

    // put every element of fetched list into todo-list <ul>
    list.forEach((element) => {
        let node = document.createElement("li");
        node.innerText = element.data;
        document.getElementById("todo-list").appendChild(node);
    });
}

async function insertTodo(todo) {
    fetch(`${server}/add_item`, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    })
        .then((response) => response.text())
        .then((text) => {
            console.log(`${text}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function addSubmitListener() {
    document.getElementById("form").addEventListener("submit", (event) => {
        // prevents from redirecting
        event.preventDefault();

        // create and insert node == <li> text-input-value </li> into <ul>
        let node = document.createElement("li");
        node.innerText = document.getElementById("text-input").value;
        document.getElementById("todo-list").appendChild(node);

        // clear text-input after submit
        document.getElementById("text-input").value = "";

        // send list item to server so it can insert it into mongodb
        const todo = { data: node.innerText };
        insertTodo(todo);
    });
}

window.addEventListener("load", async (event) => {
    // get entire list from database
    await putList();

    // add listener for the submit button
    addSubmitListener();
});
