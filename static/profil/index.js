document.addEventListener("DOMContentLoaded", async () => {


    //IMG//
    function myFuncPP(e){
        console.log(e)
    }

    //----//




    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()
    console.log(user)

    user.Rank = "moderator"
    user.Biography = "je veux du cul du cul du cul"

    const userName = document.getElementById("username")
    userName.innerText = "@" + user.UniqueName

    document.getElementById('div-img').innerHTML = `<img src="${user.ProfilPicture}" alt="">`
    document.getElementById('banner-div').style.backgroundImage = `url(${user.Banner})`

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





    const selectOption = document.getElementsByClassName('btn-cron')
    for (let i of selectOption) {
        i.addEventListener('click', e => {
            const btnSelected = e.path[1]
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            btnSelected.className += " active"

            if (btnSelected.id == "my-post") {
                //Fetch//

                //-----//
            } else if (btnSelected.id == "friend-post") {
                //Fetch//  

                //-----//
            } else if (btnSelected.id == "tag-post") {
                //Fetch//

                //-----//
            }
        })
    }


    const edit = document.getElementById('edit-profil')
    
        edit.addEventListener('click', () => {
            document.getElementById("edit-box").style.display = "flex"
            
            document.getElementById('popup-img').innerHTML = 
            `
            <label for="file">
                <img id="img-popup" src="${user.ProfilPicture}">
                <input type="file" name="file" id="file" accept="image/png, image/jpeg, image/gif, image/jpg" onchange="previewImage();">
            </label>
            
            `
            
            document.getElementById('popup-name').innerHTML = 
            `
            <p>@${user.UniqueName}</p>
            `

            document.getElementById('popup-bio').innerHTML = 
            `
            <div  id="popup-titleBio">
                <p>Bio: </p>
            </div>
            <div id="popup-text">
                <textarea id="popup-bio">${user.Biography}</textarea>
            </div>
            `

            document.getElementById('popup-retour').innerHTML = 
            `
            <p  id="popup-retour">Retour </p>
            `

            document.getElementById('popup-confirm').innerHTML = 
            `
            <p  id="popup-btnLogout">Enregistrer </p>
            `
    })
    const retour = document.getElementById('popup-retour') 
    retour.addEventListener('click', () => {
        document.getElementById('edit-box').style.display = "none"
    })
    
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

