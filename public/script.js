// const server = "https://my-todo-app-2344wqs.herokuapp.com";
const server = "http://localhost:3000";

async function fetchList() {
    // get all todos from server
    return fetch(`${server}/get_items`)
        .then((res) => res.json())
        .then((res) => res.collection)
        .catch((err) => console.log(err));
}

function putInList(todo) {
    const node = document.createElement("li");

    node.id = todo._id;

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

// insert todo into mongodb returns id of inserted todo item
async function insertTodo(todo) {
    return fetch(`${server}/add_item`, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    })
        .then((response) => response.text())
        .then((text) => {
            return text;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function deleteTodo(todo) {
    return fetch(`${server}/delete_item`, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    }).catch((error) => {
        console.error("Error:", error);
    });
}

function addSubmitListener() {
    document.getElementById("form").addEventListener("submit", (event) => {
        // prevents from redirecting
        event.preventDefault();

        const todo = { data: document.getElementById("text-input").value };

        // send list item to server so it can insert it into mongodb
        // and save it's id
        todo._id = insertTodo(todo);

        // clear text-input after submit
        document.getElementById("text-input").value = "";

        // render the added list item
        putInList(todo);
    });
}

function addDeleteListeners() {
    const list_items = document.querySelectorAll("#todo-list li");
    list_items.forEach((element) => {
        const delete_button = element.querySelector(".delete-button");
        delete_button.addEventListener("click", (event) => {
            deleteTodo({ _id: element.id });
            element.remove();
        });
    });
}

window.addEventListener("load", async (event) => {
    // get entire list from database
    await putList();

    addDeleteListeners();

    // add listener for the submit button
    addSubmitListener();
});
