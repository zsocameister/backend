//Keys of users
let keys = ["id", "name", "email"];

// Get data from server
function getServerData(url) {

    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    );
}


function startGetUsers () {
    getServerData("http://localhost:3000/users/").then(
        data => fillDataTable(data, "userTable")
    );
}


document.querySelector("#getDataButton").addEventListener("click", startGetUsers)


//Fill table with server data
function fillDataTable(data, tableID) {
    let table = document.querySelector("#" + tableID)

    if (!table) {
        console.error("Table '" + tableID + "' is not found.")
        return
    }

    //Add new user row to the table
    let tBody = table.querySelector("tbody");
    tBody.innerHTML = ''
    let newRow = newUserRow(data[0])
    tBody.appendChild(newRow);

    for (let row of data) {
        let tr = createAnyElement("tr");
        for (let k of keys) {
            let td = createAnyElement("td")
            let input = createAnyElement("input", {
                class: "form-control",
                value: row[k],
                name: k
            });
            if (k == "id"){
                input.setAttribute("readonly", true)
            }
            td.appendChild(input);
            tr.appendChild(td);
        }
        let btnGroup = createButtonGroup();
        tr.appendChild(btnGroup);
        tBody.appendChild(tr);
    }
}


function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k])
    }
    return element;

}


function createButtonGroup() {

    let group = createAnyElement("div", { class: "btn btn-group" })
    let infoButton = createAnyElement("button", { class: "btn btn-info", onclick: "setRow(this)" })
    let delButton = createAnyElement("button", { class: "btn btn-danger", onclick: "delRow(this)" })

    infoButton.innerHTML = '<i class="fa-solid fa-rotate"></i>';
    delButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    group.appendChild(infoButton);
    group.appendChild(delButton);

    let td = createAnyElement("td");
    td.appendChild(group)

    return td;
}


function delRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let id = tr.querySelector("td:first-child").innerHTML;
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    
    fetch("http://localhost:3000/users/" + id, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => startGetUsers
    );
}


function setRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch('http://localhost:3000/users/' + data.id, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => startGetUsers()
    );
}


function newUserRow(row){
    let tr = createAnyElement("tr");
    for (let k of keys) {
        let td = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: k
        });
        td.appendChild(input);
        tr.appendChild(td);
    }
    let newBtn = createAnyElement("button", {class: "btn btn-primary", onclick: "addUser(this)"});
    newBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i>';
    let td = createAnyElement("td");
    td.appendChild(newBtn);
    tr.appendChild(td);

    return tr;
}


function addUser(btn){
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('http://localhost:3000/users', fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => startGetUsers()
    );
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};

    for (let i = 0; i < inputs.length; i++){
        data[inputs[i].name] = inputs[i].value;
    }

    return data;
}