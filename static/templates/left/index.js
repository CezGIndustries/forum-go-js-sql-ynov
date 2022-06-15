document.addEventListener("DOMContentLoaded", async () => {
    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()
    // console.log(user)
    document.getElementsByClassName('logoutleft')[0].innerHTML = `<img src="${user.ProfilPicture}" alt="">`
    document.getElementsByClassName('logoutmid')[0].innerHTML = user.UniqueName
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