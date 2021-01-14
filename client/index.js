
document.addEventListener('DOMContentLoaded',()=>{
    fetch('http://localhost:5000/getAll').then(res =>res.json())
    .then(data => loadHTMLTable(data['data']))
    //.then(data => console.log(data))
});

document.querySelector('table tbody').addEventListener('click',(event)=>{
    console.log(event.target);
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn"){
        handleEditRow(event.target.dataset.id);
    }
})

function deleteRowById(id){
    fetch('http://localhost:5000/delete/'+id,{
        method:'DELETE'
    })
    .then(res=>res.json())
    .then(data =>{
        if(data.success){
            location.reload();
        }
    })
}

const addBtn = document.querySelector('#add-name-btn')
const updateBtn = document.querySelector('#update-row-btn')
console.log(addBtn);
addBtn.addEventListener('click',()=>{
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value ="";
    
    fetch('http://localhost:5000/insert',{
        headers: {
            'Content-type' : 'application/json'
        },
        method:'POST',
        body: JSON.stringify({name : name})
    }).then(res=>res.json())
    .then(data=>insertRowToTable(data['data']))

})


function insertRowToTable(data){
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for(var key in data){
        if(data.hasOwnProperty(key)){
            if(key ==="dateAdded"){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class = "delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class = "edit-row-btn" data-id=${data.id}>Edit</button></td>`;


    table.innerHTML +="</tr>";
    if(isTableData){
        table.innerHTML = tableHtml
    }else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}


function handleEditRow(id){
    const udpateSection =document.querySelector('#update-row');
    udpateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id;

}

updateBtn.addEventListener('click',()=>{
    const updateNameInput = document.querySelector('#update-name-input');
    console.log(JSON.stringify(updateNameInput.dataset.id));
    fetch('http://localhost:5000/update',{
        method:'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id:document.querySelector('#update-row-btn').dataset.id ,
            name: updateNameInput.value
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.success){

            
            //location.reload();
        }

    })
})

function loadHTMLTable(data)
{
    console.log(data)
    const table = document.querySelector('table tbody');
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml ="";

    data.forEach(function ({id,name,date_added}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class = "delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class = "edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";
        console.log('add');
    })

    table.innerHTML = tableHtml;

}