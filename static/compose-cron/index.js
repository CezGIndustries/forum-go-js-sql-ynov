import { timeLeftFunciton, SetTime, createCron } from "/static/home/index.js"
document.getElementById('button-post').addEventListener('click', () => {
    // Button that allow user to submit a cron
    const content = document.getElementById("text-value-entry-phone").value
    document.getElementById("text-value-entry-phone").value = ''
    console.log(content)
    if(content !== '') {
        const timeEntry = parseInt(document.getElementById("select-time").value)
        const timeLeft = timeLeftFunciton(timeEntry, SetTime())
        const tag = content.match(/(#\w+)/gm)
        createCron(content, tag, timeLeft)
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    
    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()

    // const img = document.querySelector('img')
    // img.src = user.ProfilPicture


    const backHome = document.getElementsByClassName('fa-space-shuttle')
    for(let i of backHome) {
        i.addEventListener('click', () => {
            window.location.href = `/home`
        })
    }
 

   
})

//already used juste repeat//

async function requestUserInfo() {
    // Get user info for the template
    return fetch('/cronosdb/POST/userInfo/GET',{
        method:'POST',
        headers: {
          "content-type": "application/json"
    }}).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}