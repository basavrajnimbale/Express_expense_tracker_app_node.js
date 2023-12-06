function login(e) {
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    console.log(loginDetails)
    axios.post('http://localhost:3000/user/login', loginDetails).then(response => {
        if(response.status === 200){
            alert(response.data.message)
        } else {
            throw new Error(response.data.message)
        }
    }).catch(err => {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`
    })
}