document.addEventListener("DOMContentLoaded", async () => {

    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()
    console.log(user)

    user.Rank = "moderator"
    user.Biography = "je veux du cul du cul du cul"

    const userName = document.getElementById("username")
    userName.innerText = "@"+ user.UniqueName

    document.getElementById('div-img').innerHTML = `<img src="./.${user.ProfilPicture}" alt="">`
    document.getElementById('banner-div').style.backgroundImage = `url(./.${user.Banner})`

    icon(user.Rank)

    if (user.FoollowU == null) {
        document.getElementById('abonnement').innerHTML = `<p class="nb"><span class="span-nb">0</span> abonnements</p>`
    } else {
        document.getElementById('abonnement').innerHTML = `<p class="nb"><span class="span-nb">${user.FoollowU}</span> abonnements</p>`
    }
    if (user.UFollow == null) {
        document.getElementById('abonnes').innerHTML = `<p class="nb"><span class="span-nb">0</span> abonnés</p>`
    } else {
        document.getElementById('abonnes').innerHTML = `<p class="nb"><span class="span-nb">${user.UFollow}</span> abonnés</p>`
    }


    document.getElementById('bio').innerHTML = `<p id="Biography">Biography: ${user.Biography}</p>`

    if (window.location.href.split("/")[4] == user.UniqueName) {
        document.getElementById('top-right-profil').innerHTML = `
        <div id="btn-profil">
            <p id="edit-profil">Editer le profil</p>
        </div>
        ` 
                                                                    
    } else if (window.location.href.split("/")[4] != user.UniqueName && user.Rank === "member") {

        document.getElementById('top-right-profil').innerHTML = `<p id="follow">Follow !</p>`

    } else if (window.location.href.split("/")[4] != user.UniqueName && user.Rank === "moderator") {
        document.getElementById('top-right-profil').innerHTML = `<p id="follow">Follow !</p>`
                                                                    

    } else if (window.location.href.split("/")[4] != user.UniqueName && user.Rank === "administrator") {
        document.getElementById('top-right-profil').innerHTML = `<p id="follow">Follow !</p>`
                                                                     
    }





    const myPost = document.getElementsByClassName('my-post')
    for (let i of myPost) {
        i.addEventListener('click', () => {
            //Function request my all cron//

            //-------/

        })
    }
    const friendPost = document.getElementsByClassName('friend-post')
    for (let i of friendPost) {
        i.addEventListener('click', () => {
            //Function request friendly cron//

            //-------/

           
        })
    }

    const tagPost = document.getElementsByClassName('tag-post')
    for (let i of tagPost) {
        i.addEventListener('click', () => {
            //Function request interest cron//
            
            //-------/
        })
    }


})

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

function icon(string) {
    if (string === "member") {
        document.getElementById('div-i').innerHTML = `<i class='fas fa-cannabis' style="color:#F970FE;"></i>`
    } else if (string === "moderator") {
        document.getElementById('div-i').innerHTML = `<i class='fas fa-people-carry' style="color:#F970FE;"></i>`
    }
    else if (string === "administrator") {
        document.getElementById('div-i').innerHTML = `<i class='fas fa-chess-queen' style="color:#F970FE;"></i>`
    }
}