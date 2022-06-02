const connect = document.getElementById("loginform");
const signup = document.getElementById("signupform");
const mbg = document.getElementById("mainbuttongroup");
const githubLogin = document.getElementById("login-github")

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

githubLogin.onclick = function(){
    var url = "https://api.github.com/user";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    
    xhr.setRequestHeader("Authorization", "Basic dXNlcm5hbWU6dG9rZW4=");
    
    xhr.onreadystatechange = function () {
       if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
       }};
    
    xhr.send();
    console.log(xhr)
    console.log("siuu")
}
console.log(githubLogin)

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
