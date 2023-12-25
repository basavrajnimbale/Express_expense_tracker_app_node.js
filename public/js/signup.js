const formSubmit = document.getElementById('user-post')
formSubmit.addEventListener('submit', signup)

async function signup(e) {
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        console.log(response)
            if(response.status === 201){
                window.location.href = "/views/login.html"
            } else {
                throw new Error('Failed to login')
            }
    }catch(err){
        document.body.innerHTML += `<div style="color:red;">${err} ></div>`;
    }
}
