const form = document.getElementById('expense-form')
const ul = document.getElementById('listOfExpenses')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let expenseamount = document.getElementById('expenseamount').value;
    let description = document.getElementById('description').value;
    let category = document.getElementById('category').value;
    let expenseDetails = {
        expenseamount,
        description,
        category,
    }
    try {
        const token = localStorage.getItem('token')
        let result = await axios.post('http://localhost:3000/expense/add-expense ', expenseDetails, { headers: { "Authorization": token } });
        displayDetails(result.data.expense);
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
    li.innerHTML = `<div>${object.expenseamount} - ${object.description} - ${object.category} <button type='button' class="button" onclick='deleteExpense(${object.id})'>Delete Expense</button></div>`;
    ul.appendChild(li);
}

async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('token')
        let result = await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, { headers: { "Authorization": token } });
        document.getElementById(`${id}`).remove();
        upadatedExpensefun(result.data.user)

    }
    catch {
        console.log('error - delete error');
        console.log('Error occurred while delecting data.');
    }
}

function upadatedExpensefun(userDetails) {
    const updateExpense = document.getElementById(`leaderBoard${userDetails.id}`)
    if(updateExpense)
    updateExpense.textContent = `Name - ${userDetails.name}, Total Expense - ${userDetails.totalExpenses}`;

}

function download(){
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
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
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.visibility = "hidden"
            document.getElementById('message').innerHTML = "you are a primium user"
            console.log(res.data + 'hiii')
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
    console.log(inputElement + 'this is inputelement')
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
                listItem.id = `leaderBoard${userDetails.id}`
                listItem.textContent = `Name - ${userDetails.name}, Total Expense - ${userDetails.totalExpenses}`;
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