const form = document.getElementById('expense-form')
const ul = document.getElementById('listOfExpenses') 

form.addEventListener('submit', async (e) =>{
    e.preventDefault();
    let expenseamout = document.getElementById('expenseamout').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    let expenseDetails = {
        expenseamout,
        description,
        category
    }
    try {
        let result = await axios.post('http://localhost:3000/user/add-expense ', expenseDetails);
        console.log('hiiii' + result.data)
        displayDetails(result.data);
        form.reset();
    }
    catch {
        console.log('error - post error');
    }
})

function displayDetails(object) {
    let li = document.createElement('li');
    li.id = `delete${object.id}`;
    li.classList.add("firstLi")
    li.innerHTML = `<div>${object.expenseamout} - ${object.description} - ${object.category} <button type='button' class="button" onclick='deleteExpense(${object.id})'>Delete Expense</button></div>`;
    ul.appendChild(li);
}

async function deleteExpense(id) {
    try {
        let result = await axios.delete(`http://localhost:3000/user/delete-expense/${id}`);
        document.getElementById(`delete${id}`).remove();
    }
    catch {
        console.log('error - delete error');
        console.log('Error occurred while delecting data.');
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        let result = await axios.get('http://localhost:3000/user/get-expenses');
        console.log(result)
        console.log(result.data)
        result.data.forEach((expense) => {
            console.log(expense);
            displayDetails(expense);
        })
    }
    catch {
        console.log('error - get error')
        console.log('Error occurred while fetching or processing data.');
    }
});