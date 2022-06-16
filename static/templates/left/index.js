document.addEventListener("DOMContentLoaded", async () => {
    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()
    // console.log(user)
    document.getElementsByClassName('logoutleft')[0].innerHTML = `<img src="${user.ProfilPicture}" alt="">`
    document.getElementsByClassName('logoutmid')[0].innerHTML = user.UniqueName

    const accueil = document.getElementsByClassName('accueil')
    for(let i of accueil) {
        i.addEventListener('click', () => {
            window.location.href = `/home`
        })
    }
    const notif = document.getElementsByClassName('notif')
    for(let i of notif) {
        i.addEventListener('click', () => {
            window.location.href = `/notif`
        })
    }
    const profil = document.getElementsByClassName('profil')
    for(let i of profil) {
        i.addEventListener('click', () => {
            window.location.href = `/profil`
        })
    }
    const contact = document.getElementsByClassName('contact')
    for(let i of contact) {
        i.addEventListener('click', () => {
            window.location.href = `/contact`
        })
    }
})

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