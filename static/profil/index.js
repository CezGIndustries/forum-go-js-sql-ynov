import { helloCron } from "./../home/templateCron.js"



document.addEventListener("DOMContentLoaded", async () => {

    // Function that while be load when page is load
    console.log("Template is loaded.")

    const pseudoUser = window.location.href.split("/")[4]

    const actualUser = await userExist(pseudoUser)
    console.log(actualUser.UniqueName)
    if (actualUser.ERROR == "404") {
        window.location.href = "/error"
    }
    console.log(actualUser.UniqueName)









    const load = await userCron(pseudoUser)
    load.forEach(async e => {
        if (e.ParentID == -1) {
            helloCron(null, e, 1)
        } else {
            const parentCron = await requestCron(e.ParentID)
            helloCron(parentCron, cron, 1)
        }
    })

    const user = await requestUserInfo()

    const divUserName = document.getElementById("div-username")
    divUserName.innerHTML = `<p id="username">@${actualUser.UniqueName}</p>`
    console.log(document.getElementById("username"))


    document.getElementById('div-img').innerHTML = `<img src="${actualUser.ProfilPicture}" alt="">`
    document.getElementById('banner-div').style.backgroundImage = `url(${actualUser.Banner})`

    icon(actualUser.Rank)

    if (actualUser.FoollowU == null) {
        document.getElementById('abonnement').innerHTML = `<p class="nb"><span class="span-nb">0</span> abonnements</p>`
    } else {
        document.getElementById('abonnement').innerHTML = `<p class="nb"><span class="span-nb">${actualUser.FoollowU}</span> abonnements</p>`
    }
    if (actualUser.UFollow == null) {
        document.getElementById('abonnes').innerHTML = `<p class="nb"><span class="span-nb">0</span> abonnés</p>`
    } else {
        document.getElementById('abonnes').innerHTML = `<p class="nb"><span class="span-nb">${actualUser.UFollow}</span> abonnés</p>`
    }
    document.getElementById('bio').innerHTML = `<p id="Biography">Biography: ${actualUser.Biography}</p>`



    if (actualUser.UniqueName == user.UniqueName) {
        document.getElementById('top-right-profil').innerHTML = `
        <div id="btn-profil">
            <p id="edit-profil">Editer le profil</p>
        </div>
        `

    } else if (actualUser.UniqueName != user.UniqueName ) {

        document.getElementById('top-right-profil').innerHTML = `<p id="follow">Follow !</p>`
        document.getElementById('myPost').innerText = "Crons postés" 

    } 
    
    const selectOption = document.getElementsByClassName('btn-cron')
    for (let i of selectOption) {
        i.addEventListener('click', async e => {
            const btnSelected = e.path[1]
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            btnSelected.className += " active"

            if (btnSelected.id == "my-post") {
                //Fetch//
                document.getElementsByClassName('div-all-article')[0].innerHTML = ""
                const myCron = await userCron(actualUser.UniqueName)
                myCron.forEach(async e => {
                    if (e.ParentID == -1) {
                        helloCron(null, e, 1)
                    } else {
                        const parentCron = await requestCron(e.ParentID)
                        helloCron(parentCron, cron, 1)
                    }
                })
            } else if (btnSelected.id == "friend-post") {
                document.getElementsByClassName('div-all-article')[0].innerHTML = ""
                const myCron = await friendCron(actualUser.UniqueName)
                myCron.forEach(async e => {
                    if (e.ParentID == -1) {
                        helloCron(null, e, 1)
                    } else {
                        const parentCron = await requestCron(e.ParentID)
                        helloCron(parentCron, cron, 1)
                    }
                })
            } else if (btnSelected.id == "tag-post") {
                document.getElementsByClassName('div-all-article')[0].innerHTML = ""
                const myCron = await tagCron(actualUser.UniqueName)
                myCron.forEach(async e => {
                    if (e.ParentID == -1) {
                        helloCron(null, e, 1)
                    } else {
                        const parentCron = await requestCron(e.ParentID)
                        helloCron(parentCron, cron, 1)
                    }
                })
            }
        })
    }


    let edit  = document.getElementById('edit-profil')
    if (edit === null) {
        await FoollowUnFollow(actualUser.UniqueName)
    } else {
        edit = document.getElementById('edit-profil')
        edit.addEventListener('click', () => {
            document.getElementById("edit-box").style.display = "flex"
            document.getElementById('popup-banner').innerHTML =
                `
                        <label id="label-banner" for="banner">
                            <img id="popup-img-baner" src="${user.Banner}">
                            <input type="file" name="file" id="banner" accept="image/png, image/jpeg, image/gif, image/jpg" onchange="loadBanner();">
                        </label>
                    `
            document.getElementById('popup-img').innerHTML =
                `
                        <label id="label-pp" for="pp">
                            <img id="img-USER" src="${user.ProfilPicture}">
                            <input type="file" name="file" id="pp" accept="image/png, image/jpeg, image/gif, image/jpg" onchange="loadPP();">
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
                        <textarea id="popup-textarea">${user.Biography}</textarea>
                    </div>
                    `

            document.getElementById('popup-status').innerHTML =
                `
                    <p  id="popup-lestatus">Status: ${user.Rank} </p>
                    `

            document.getElementById('popup-retour').innerHTML =
                `
                    <p  id="popup-leretour">Retour </p>
                    `

            document.getElementById('popup-confirm').innerHTML =
                `
                    <p  id="popup-btnConfirm">Enregistrer </p>
                    `
        })


    }




    const retour = document.getElementById('popup-retour')
    retour.addEventListener('click', () => {
        document.getElementById('edit-box').style.display = "none"
    })


    const confirm = document.getElementById('popup-confirm')
    confirm.addEventListener('click', () => {
        fetch('/cronosdb/POST/userInfo/PPBIO', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                uniqueName: window.location.href.split("/")[4],
                bio: document.getElementById('popup-textarea').value,
                pp: document.getElementById('img-USER').src,
                banner: document.getElementById('popup-img-baner').src,

            })
        })
        location.reload()
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
async function FoollowUnFollow(pseudo) {
    return fetch('/cronosdb/POST/profil/CRON_USER', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            UniqueName: pseudo,
        })
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
async function userCron(pseudo) {
    return fetch('/cronosdb/POST/profil/CRON_USER', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            UniqueName: pseudo,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}
async function friendCron(pseudo) {
    return fetch('/cronosdb/POST/profil/CRON_FRIENDS', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            UniqueName: pseudo,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}

async function tagCron(pseudo) {
    return fetch("/cronosdb/POST/profil/CRON_TAG", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            UniqueName: pseudo,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}

async function requestCron(id) {
    // Ask to database every information on a cron
    return fetch('/cronosdb/POST/cron/GET', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: id,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}

async function userExist(pseudo) {
    return fetch("/cronosdb/POST/userInfo/EXIST", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            UniqueName: pseudo,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}
