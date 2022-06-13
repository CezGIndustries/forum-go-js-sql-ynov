const connect = document.getElementById("loginform");
const signup = document.getElementById("signupform");
const mbg = document.getElementById("mainbuttongroup");
const githubLogin = document.getElementById("login-github")


function register() {
    connect.style.left = "-400px";
    signup.style.left = "50px";
    mbg.style.left = "110px";
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
}
// console.log(githubLogin)

const confirmLogin = () => {
    fetch('/cronosdb/POST/logUsers/CHECK', {
        method: 'POST',
        header: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            uniqueName: document.getElementById('email_login_login').value,
            email: document.getElementById('email_login_login').value,
            password: document.getElementById('password_login').value
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        if(res.ERROR == 404) {
            // METTRE ERROR
        } else {
            window.location.href= '/home'
        }
    })
}

const confirmRegister = () => {
    // To get the form values
    const email = document.getElementById('email_register').value
    const pseudo = document.getElementById('pseudo_register').value
    const password = document.getElementById('password_register').value
    const confirmPassword = document.getElementById('confirm_password_register').value

    // Additionnal content

    // --------------

    // Condition that check the validity of the values
    if(pseudoIsGood(pseudo) && validateEmail(email) && passwordIsGood(password, confirmPassword)){
        fetch('/cronosdb/POST/logUsers/REGISTER', {
            method: 'POST',
            header: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                uniqueName: pseudo,
                email: email,
                password: password,
            })
        }).then((res) => {
                return res.json()
        }).then((res) => {
            if(res.ERROR == '409') {
                // METTRE ERROR
            } else {
                window.location.href = '/home'
            }
        })
    } else {
        console.log("Error: Form unvalide")
    }
}

function pseudoIsGood(string) {
    return 3 <= string.length && string.length <= 32 && string.match(/[^A-Za-z0-9]/g) === null
}

function passwordIsGood(password, confirmPassword) {
    return password.length >= 6 && password === confirmPassword
}

function validateEmail(email) {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null
  }
