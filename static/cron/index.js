import { helloCron } from "./../home/templateCron.js"

document.addEventListener("DOMContentLoaded", async () => {
    const idCron = window.location.href.split("/")[5]
    

    const cronActual = await fetchCron(idCron)
    if (cronActual.ERROR == "404") {
        window.location.href = "/error"
    }

    document.getElementsByClassName('div-all-article')[0].style.height = "100%"
    const user = await requestUserInfo()


    document.getElementById("img-profile").innerHTML = `
        <img id="img-cron-page" src="${user.ProfilPicture}">
    `
    


    helloCron(null, cronActual, 1)
    const submit = document.getElementById("submit")
    submit.addEventListener('click', async () => {
        const content = document.getElementById("text-value-entry").value
        document.getElementById("text-value-entry").value = ''
        if (content !== '') {
            const parentID = idCron
            const tag = content.match(/(#\w+)/gm)
            createComment(content, tag, parentID)
            location.reload()
        }
    })
    const tabId = cronActual.Comments
    tabId.reverse()
    for(let i = 0; i < tabId.length; i++){

    
    // tabId.ForEach(async e => {
        const hi = await fetchCron(tabId[i])
        let liked = 'fa-thumbs-o-up'

        if (hi.Likes === null) {
            hi.Likes = []
        }
        if (hi.Likes.includes(document.getElementsByClassName('logoutmid')[0].textContent) || hi.Likes.includes(window.location.href.split("/")[4])) {
            liked = "fa fa-thumbs-up"
        }
        const Like = hi.Likes.length
        if (hi.Comments === null) {
            hi.Comments = []
        }
        const Comment = hi.Comments.length
        const newCron = `
        <div id-cron="${hi.ID}" class="article">
            <div class="user-wrapper">
                <div class="image-user">
                    <div class="user-image">
                        <img class="img-cron-user" src=""
                        alt="">
                    </div>
                </div>
                <div class="pseudo-user">${hi.creator}</div>
                <div class="options-admin">
                    <i class="fa fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="article-text">
                <div class="div-article">
                    <article class="article-area">
                        <div class="text">${hi.content}</div>
                        <div class="media"></div>
                    </article>
                </div>
            </div>
            <div class="partage">
                <div class="left-partage">
                    <div class="like btn-action">
                        <p id="${hi.ID}" click="false">${Like}</p>
                        <i id-cron="${hi.ID}" class="fa ${liked}" style="color:#F970FE;"></i>
                    </div>
                    <div class="comment btn-action">
                        <p id="${hi.ID}">${Comment}</</p>
                        <i class="fa fa-commenting"></i>
                    </div>
                    <div class="share btn-action">
                        <i class="fa fa-share-alt"></i>
                    </div>
                </div>
                <div class="right-partage">
                    <div class="time">
                   
                    </div>
                </div>
            </div>
        </div>  
        `

        document.getElementById("all-other-comments").innerHTML += newCron
        
        const allImgCron = Array.from(document.getElementsByClassName("mg-cron-user"))
        allImgCron.forEach(async e =>{
            const actualUser = await userExist(hi.creator)
            e.src = actualUser.ProfilPicture
        })
    }

    

    if (user.Rank === "member") {
        const paramsModo = Array.from(document.getElementsByClassName('fa-ellipsis-h'))
        paramsModo.forEach(e => {
            e.style.display = 'none'
        })
    }


})

async function fetchCron(id) {
    return fetch("/cronosdb/POST/cron/GET", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: Number(id),
        })
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
async function createComment(content, tag, parentID) {
    return fetch("/cronosdb/POST/cron/CREATE", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            content: content,
            tag: tag,
            parentID: Number(parentID),

        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        console.log(res)
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
