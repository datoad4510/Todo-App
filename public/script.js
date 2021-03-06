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

function dateToDatetimeLocal(string) {
    // https://stackoverflow.com/questions/28760254/assign-javascript-date-to-html5-datetime-local-input
    if (string == "Invalid Date") {
        return "";
    }
    let temp = new Date(string).toISOString();
    return temp.substring(0, temp.length - 1);
}

function putInList(todo) {
    const node = document.createElement("li");

    node.id = todo._id;

    const paragraph = document.createElement("p");
    paragraph.innerText = todo.data;
    node.appendChild(paragraph);

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

    const datetime_input = document.createElement("span");
    datetime_input.className = "time-span";
    datetime_input.innerText = new Date(todo.time).toLocaleString();
    console.log(new Date(datetime_input.innerText));

    const edit_button = document.createElement("button");
    edit_button.innerText = "Edit";
    edit_button.className = "edit-button";
    edit_button.addEventListener("click", async (event) => {
        // get fresh data, because it might've changed due to previous edits
        let this_todo = document.getElementById(node.id);
        let this_paragraph = this_todo.getElementsByTagName("p")[0];
        let this_date = this_todo.getElementsByTagName("span")[0];

        // make list container invisible
        const container = document.getElementById("container");
        container.classList.toggle("display-none");

        // make edit-container visible
        const edit_container = document.getElementById("edit-container");
        edit_container.classList.toggle("display-none");

        // add text to be edited
        const edit_text = document.createElement("input");
        edit_text.type = "text";
        edit_text.id = "edit-text";
        edit_text.value = this_paragraph.innerText;
        edit_container.appendChild(edit_text);

        // add date to be edited
        const edit_datetime_local = document.createElement("input");
        edit_datetime_local.type = "datetime-local";
        edit_datetime_local.value = dateToDatetimeLocal(this_date.innerText);
        edit_container.appendChild(edit_datetime_local);

        // add save button
        const save_button = document.createElement("input");
        save_button.type = "button";
        save_button.id = "save-button";
        save_button.value = "Save";
        save_button.addEventListener("click", async (event) => {
            try {
                // if you remove this await, ui will update first
                // will fill faster, may be more unreliable
                await updateTodo({
                    _id: node.id,
                    data: edit_text.value,
                    time: edit_datetime_local.value,
                });
            } catch (err) {
                throw err;
            }

            // get fresh data, because it might've changed due to previous edits
            this_todo = document.getElementById(node.id);
            this_paragraph = this_todo.getElementsByTagName("p")[0];
            this_date = this_todo.getElementsByTagName("span")[0];

            // update ui
            this_paragraph.innerText = edit_text.value;
            this_date.innerText = edit_datetime_local.value;

            // make list container invisible
            container.classList.toggle("display-none");

            // delete contents of edit container
            // https://stackoverflow.com/questions/48310643/removing-childnodes-using-node-childnodes-foreach
            const children = edit_container.childNodes;

            // iterate backwards, explained in the link
            for (let index = children.length - 1; index >= 0; index--) {
                children[index].remove();
            }

            // make edit-container visible
            edit_container.classList.toggle("display-none");
        });

        edit_container.appendChild(save_button);
    });

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
                time: document.getElementById("time-input").value,
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
            document.getElementById("time-input").value = "";

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
