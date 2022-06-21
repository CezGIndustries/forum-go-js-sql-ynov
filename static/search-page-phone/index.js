document.addEventListener("DOMContentLoaded", async () => {
    console.log("Template right loaded")
    const famousTags = await famousTagsFetch()
    const user = await requestUserInfo()
    let tagFamous = []
    for (const [key, value] of Object.entries(famousTags)) {
        tagFamous.push([key, value])
    }
    tagFamous.sort(function (a, b) {
        return b[1] - a[1]
    })
    const divTags = document.getElementById('bot-bot')
    divTags.innerHTML = ""
    for (let i = 0; i < 5 && i < tagFamous.length; i++) {
        divTags.innerHTML += `
        <div class="tendance">
        <div class="tdc-top">
            <div class="left-name">
                <p class="name-tag"> ${tagFamous[i][0]}</p>
            </div>
            <div class="right-name">
                <i class="params-tag fa fa-ellipsis-h"></i>
            </div>
        </div>
        <div class="tdc-bot">
            <div class="left-stat">
                <p class="stat-all">${tagFamous[i][1]} Crons</p>
            </div>
            <div class="right-stat">
                <p class="stat-last-day">${tagFamous[i][1]} last 24h</p>
            </div>
    
        </div>
    </div>
        `
    }


    const valide = document.getElementById('redirect-user')
  
    valide.addEventListener('click', e => {
        const valueInput = document.getElementById('research').value
        console.log(valueInput[0])
        if(valueInput != null){
            if(valueInput[0] == "@"){
                window.location.href = `/profil/${valueInput.replace("@", "")}`
            }else if (valueInput[0] == "#"){
                window.location.href = `/error`
            }else{
                alert("recherche err: élément manquant @ ou # ")
            }
        }else{
            alert("recherche err: null")
        }
        document.getElementById('research').value = ""


        
    })
    document.getElementsByClassName("fa-fighter-jet")[0].addEventListener('click', e => {
        window.location.href ="/home"
    })
    console.log(user.ProfilPicture)
    const img =document.getElementsByClassName("img")[0]
    img.innerHTML =`
        <img id="ma-teter" src="${user.ProfilPicture}">
    `
    img.addEventListener("click", e => {
        window.location.href = `/profil/${user.UniqueName}`
    })
  





})

async function famousTagsFetch() {
    return fetch('/cronosdb/POST/tag/GET_FAMOUS_TAG', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        }
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}
async function requestUserInfo() {
    // Get user info for the template
    return fetch('/cronosdb/POST/userInfo/GET', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        }
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}