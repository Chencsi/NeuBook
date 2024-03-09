import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import {Table} from './models/Table.mjs'
import {KEY,TOKEN} from './utils/constants.mjs'

let tables = []

fetch(`https://api.trello.com/1/members/me/boards?key=${KEY}&token=${TOKEN}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`)
    return res.json()
}).then(boards => {
    for (let board of boards) {
        let table = new Table(board.id, board.name, board.desc, board.idOrganization)
        tables.push(table)
        console.log(board)
    }
    displayTables()
}).catch(err => console.error(err))

function getOrganizationName(id){
    fetch(`https://api.trello.com/1/organizations/${id}?key=${KEY}&token=${TOKEN}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => {
        console.log(`Response: ${res.status} ${res.statusText}`)
        return res.json()
    }).then(org => {
        console.log(org)
        return org.displayName
    }).catch(err => console.error(err))

}

function displayTables(){
    let tablesDiv = document.querySelector('.tables')
    for (let table of tables) {
        tablesDiv.innerHTML += 
        `<div class="col-12 col-md-6 col-lg-4">
            <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${table.name}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${getOrganizationName(table.organization)}</h6>
                <p class="card-text">${table.desc}</p>
            </div>
            </div>
        </div>`
    }
}