const server = "https://my-todo-app-2344wqs.herokuapp.com";
// const server = "http://localhost:3000";

async function fetchList() {
    // get all todos from server
    return fetch(`${server}/get_items`)
        .then((res) => res.json())
        .then((res) => res.collection)
        .catch((err) => console.log(err));
}

function putInList(todo) {
    const node = document.createElement("li");

    const paragraph = document.createElement("p");
    paragraph.innerText = todo.data;
    node.appendChild(paragraph);

    const edit_button = document.createElement("button");
    edit_button.innerText = "Edit";
    edit_button.className = "edit-button";

    const delete_button = document.createElement("button");
    delete_button.innerText = "Delete";
    delete_button.className = "delete-button";

    node.appendChild(edit_button);
    node.appendChild(delete_button);

    document.getElementById("todo-list").appendChild(node);
}

async function putList() {
    const list = await fetchList();

    // put every element of fetched list into todo-list <ul>
    list.forEach((element) => {
        putInList(element);
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

        const todo = { data: document.getElementById("text-input").value };

        // clear text-input after submit
        document.getElementById("text-input").value = "";

        // create and insert node == <li> text-input-value </li> into <ul>
        putInList(todo);

        // document.getElementById("todo-list").appendChild(node);

        // send list item to server so it can insert it into mongodb

        insertTodo(todo);
    });
}

window.addEventListener("load", async (event) => {
    // get entire list from database
    await putList();

    // add listener for the submit button
    addSubmitListener();
});
