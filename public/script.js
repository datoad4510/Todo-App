// https://www.reddit.com/r/javascript/comments/7jc7fy/what_is_wrong_with_return_await_when_you_want_to/
// http://hassansin.github.io/Why-return-await-Is-a-Bad-Idea

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
    delete_button.addEventListener("click", async (event) => {
        // if you remove this await, ui will update first
        // will fill faster, may be more unreliable
        await deleteTodo({ _id: node.id });
        node.remove();
    });

    const finished_checkbox = document.createElement("input");
    finished_checkbox.type = "checkbox";
    finished_checkbox.className = "finished-checkbox";
    finished_checkbox.checked = todo.finished;
    finished_checkbox.addEventListener("click", async (event) => {
        // if you remove this await, ui will update first
        // will fill faster, may be more unreliable
        await updateTodo({ _id: node.id, finished: finished_checkbox.checked });
        paragraph.classList.toggle("finished");
    });

    // for initial style
    if (finished_checkbox.checked) {
        paragraph.classList.add("finished");
    } else {
        paragraph.classList.remove("finished");
    }

    const datetime_input = document.createElement("input");
    datetime_input.type = "datetime-local";
    datetime_input.class = "datetime-input";
    datetime_input.name = "to-finish-time";

    node.appendChild(edit_button);
    node.appendChild(delete_button);
    node.appendChild(datetime_input);
    node.appendChild(finished_checkbox);

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
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function deleteTodo(todo) {
    return (
        fetch(`${server}/delete_item`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        })
            //.then((res) => res.json())
            //.then((json) => json.deletedCount)
            .catch((error) => {
                console.error("Error:", error);
            })
    );
}

async function updateTodo(todo) {
    return fetch(`${server}/update_item`, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    }).catch((error) => {
        console.error("Error:", error);
    });
}

async function addSubmitListener() {
    document
        .getElementById("form")
        .addEventListener("submit", async (event) => {
            // prevents from redirecting
            event.preventDefault();

            const todo = {
                data: document.getElementById("text-input").value,
                finished: false,
            };

            // send list item to server so it can insert it into mongodb
            // and save it's id
            todo._id = await insertTodo(todo);

            // why does it have extra "" around it?? this line is for
            // pruning to avoid the bug
            // maybe due to response.text(c)
            todo._id = todo._id.substring(1, todo._id.length - 1);
            console.log(todo._id);

            // clear text-input after submit
            document.getElementById("text-input").value = "";

            // render the added list item
            putInList(todo);
        });
}

window.addEventListener("load", async (event) => {
    // get entire list from database
    await putList();

    // add listener for the submit button
    addSubmitListener();
});
