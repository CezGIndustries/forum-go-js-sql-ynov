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
    fetch('/chronosdb/POST/logUsers', {
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
    }).then((res) => {
        console.log(res)
    })
}

const confirmRegister = () => {
    //recuperation des données pour crée l'utilisateur//
    const email = document.getElementById('email_register').value
    const pseudo = document.getElementById('pseudo_register').value
    const password = document.getElementById('password_register').value
    const confirmPassword = document.getElementById('confirm_password_register').value
    // ajouter le contenu additionel ici ! //


    //--------//
    
    //condition qui return true si tout est ok dans les données
    if(PseudoIsGood(pseudo) && validateEmail(email) != null && passwordIsGood(password, confirmPassword)){
        console.log("Données valide !")
        fetch('/chronosdb/POST/logUsers/REGISTER', {
            method: 'POST',
            header: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                pseudo: pseudo,
                password: password,
            })
        }).then((res) => {
                return res.json()
        }).then((res) => {
            console.log(res)
        })
    }else{
        console.log("error: login refuse")
    }
}

function PseudoIsGood(string){
    const good = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    for (let i = 0; i < string.length; i++) {
        if(!good.includes(string[i])){
            return false
        }
      }
    return true   
}

function passwordIsGood(password , confirmPassword){
    if(password === confirmPassword && password.length >= 8 ){
        return true
    }
    console.log("password not = || len <8")
    return false
}

const validateEmail = (email) => {
    console.log(email)
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };