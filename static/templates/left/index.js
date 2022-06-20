document.addEventListener("DOMContentLoaded", async () => {

    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()
    // console.log(user)
    document.getElementsByClassName('logoutleft')[0].innerHTML = `<img src="${user.ProfilPicture}" alt="">`
    document.getElementsByClassName('logoutmid')[0].innerHTML = user.UniqueName

    const accueil = document.getElementsByClassName('accueil')
    for (let i of accueil) {
        i.addEventListener('click', () => {
            window.location.href = `/home`
        })
    }
    const notif = document.getElementsByClassName('notif')
    for (let i of notif) {
        i.addEventListener('click', () => {
            window.location.href = `/notif`
        })
    }
    const profil = document.getElementsByClassName('profil')
    for (let i of profil) {
        i.addEventListener('click', () => {
            window.location.href = `/profil/${user.UniqueName}`
        })
    }
    const contact = document.getElementsByClassName('contact')
    for (let i of contact) {
        i.addEventListener('click', () => {
            window.location.href = `/contact`
        })
    }
    const explore = document.getElementsByClassName('explore-responsive')
    for (let i of explore) {
        i.addEventListener('click', () => {
            window.location.href = '/explore'
        })
    }
    const buttonPhonePost = document.getElementsByClassName('post-popup')
    for (let i of buttonPhonePost) {
        i.addEventListener('click', () => {
            window.location.href = "/compose/cron"
        })
    }
    if (user.ERROR == 404) {
        document.getElementsByClassName('logout-bot')[0].style.display = 'none'
    } else {
        const signout = document.getElementsByClassName('fa-sign-out')
        for (let i of signout) {
            console.log(i)
            i.addEventListener('click', () => {
                fetch('/cronosdb/POST/logUsers/DISCONNECT', {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    }
                }).then(() => {
                    window.location.href = '/connexion'
                })
            })
        }
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

function exploreFunction(e) {
    const body = document.querySelector("body")

    const divExplore = `
    <div class="explore-div">
        
    </div>
    `
    body.innerHTML = divExplore

}

function createCron(content, tag, timeLeft) {
    // Add cron to database
    fetch('/cronosdb/POST/cron/CREATE', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            content: content,
            timeLeft: timeLeft,
            tag: tag,
            parentID: -1,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        if (res.ERROR == 403) {
            window.location.href = `/connexion`
        } else {
            drawCrons(res)
        }
    })
}
