const connect = document.getElementById("loginform");
const signup = document.getElementById("signupform");
const mbg = document.getElementById("mainbuttongroup");

function register() {
    connect.style.left = "-400px";
    signup.style.left = "50px";
    mbg.style.left = "110px";
    console.log("register");
}

function login() {
    connect.style.left = "50px";
    signup.style.left = "450px";
    mbg.style.left = "0";
}


const confirmLogin = () => {
    console.log('hello')
    fetch('/login_auth', {
        method: 'POST',
        header: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            method: "LOGIN",
            email: document.getElementById('email_login_login').value,
            password: document.getElementById('password_login').value
        })
        

    }).then((res) => {
        return res.json()
    })
}