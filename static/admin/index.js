fetch("/cronosdb/POST/adminAccess/CHECK", {
    method: 'POST',
    header: {
        "content-type": "application/json"
    }
}).then((res) => {
    return res.json()
}).then((res) => {
    if (res.ERROR == 403) {
        window.location.href = '/connexion'
    }
})

for (let i of document.getElementsByClassName('onglet')) {
    i.addEventListener('click', () => {
        for (let k of document.getElementsByClassName('onglet')) {
            k.classList.remove('active')
        }
        i.classList.add('active')
        const animAttr = i.getAttribute('data-anim')
        for (let k of document.getElementsByClassName('contenu')) {
            if (k.getAttribute('data-anim') == animAttr) {
                k.classList.add('activeContenu')
                switch (animAttr) {
                    case "1":
                        EveryUsersInfo(k)
                        break
                    case "2":
                        k.innerHTML = `BANNED`
                        break
                    case "3":
                        k.innerHTML = `UESR RPEORTED`
                        break
                    case "4":
                        k.innerHTML = `CRON REPORTED`
                        break
                    default:
                        console.log("None")
                }
            } else {
                k.classList.remove('activeContenu')
            }
        }
    })
}

async function EveryUsersInfo(div) {
    const user = await requestUserInfo()
    const allUsers = await requestAllUsers(user.Rank)
    div.innerHTML = ''
    for(let i of allUsers.AllUsers) {
        console.log(i)
        div.innerHTML += `<img id="img-USER" src="${i.ProfilPicture}">, ${i.UniqueName}, ${i.Rank}`
    }
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

async function requestAllUsers(rank) {
    // Get user info for the template
    return fetch('/cronosdb/POST/getAllUsers/GET', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            Rank: rank,
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        return res
    })
}
