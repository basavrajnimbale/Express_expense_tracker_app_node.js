const form = document.getElementById('expense-form')
const ul = document.getElementById('listOfExpenses')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let expenseamout = document.getElementById('expenseamout').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    let expenseDetails = {
        expenseamout,
        description,
        category,
    }
    try {
        const token = localStorage.getItem('token')
        let result = await axios.post('http://localhost:3000/expense/add-expense ', expenseDetails, { headers: { "Authorization": token } });
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
    li.id = `${object.id}`;
    li.classList.add("firstLi")
    li.innerHTML = `<div>${object.expenseamout} - ${object.description} - ${object.category} <button type='button' class="button" onclick='deleteExpense(${object.id})'>Delete Expense</button></div>`;
    ul.appendChild(li);
}

async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('token')
        let result = await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, { headers: { "Authorization": token } });
        // console.log(result.data)
        document.getElementById(`${id}`).remove();

    }
    catch {
        console.log('error - delete error');
        console.log('Error occurred while delecting data.');
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } })
    console.log(response);
    var options =
    {
        "key": response.data.key_id, //Enter the key ID generated from the Dashboard
        "order_id": response.data.order.id, //for one time payment 
        //this handle function will handle the success payment
        "handler": async (response) => {
            console.log('testing')
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML = "you are a primium user"
            localStorage.setItem('token', res.data.token)
            showLeaderBoard()
        },
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something went wrong')
    })
}

function showLeaderBoard() {
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = async () => {
        try {
            const token = localStorage.getItem('token');
            const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', {
                headers: { "Authorization": token }
            });

            const leaderboardElem = document.getElementById('leaderboard');
            leaderboardElem.innerHTML = '<h1>Leader Board</h1>'; // Clear previous content before appending new data

            userLeaderBoardArray.data.forEach((userDetails) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Name - ${userDetails.name}, Total Expense - ${userDetails.total_cost}`;
                leaderboardElem.appendChild(listItem);
            });
        } catch (error) {
            console.log(error);
        }
    };
    document.getElementById("message").appendChild(inputElement);
}

function showPrimiumuserMessage(){
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "you are a primium user" 
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


window.addEventListener('DOMContentLoaded', async () => {

    try {
        const token = localStorage.getItem('token')
        const decodeToken = parseJwt(token)
        console.log(decodeToken)
        const ispremiumuser = decodeToken.ispremiumuser
        if(ispremiumuser){
            showPrimiumuserMessage();
            showLeaderBoard()
        }
        let result = await axios.get('http://localhost:3000/expense/get-expenses', { headers: { "Authorization": token } });
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