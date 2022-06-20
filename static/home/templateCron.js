export async function helloCron(parentCron, cron, asc) {
    let liked = 'fa-thumbs-o-up'

    if (cron.Likes === null) {
        cron.Likes = []
    }
    if (cron.Likes.includes(document.getElementsByClassName('logoutmid')[0].textContent) || cron.Likes.includes(window.location.href.split("/")[4])) {
        liked = "fa fa-thumbs-up"
    }


    const allCron = document.querySelector('.div-all-article')

    const Like = cron.Likes.length
    if (cron.Comments === null) {
        cron.Comments = []
    }
    const Comment = cron.Comments.length
    let newCron = ``;
    if (parentCron != null) {

        newCron = `
        <div id-cron="${parentCron.ID}" class="article">
        <div class="article-top">
            <div class="child-to-child-top">
                <p class="redirect-parent">en réponse à @${parentCron.creator}...</p>
            </div>
            <div class="child-to-child-bot">
                <div class="left-coin">
                    <div class="ligne"></div>
                </div>
            </div>
        </div>
        <div class="article-bot">
            <div class="user-wrapper">
                <div class="image-user">
                    <div class="user-image">
                        <img class="img-cron-user" src=""
                            alt="">
                    </div>
                </div>
                <div class="pseudo-user">${cron.creator}</div>
                <div class="options-admin">
                    <i class="fa fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="article-text">
                <div class="div-article">
                    <article class="article-area">
                        <div class="text">${cron.content}</div>
                        <div class="media"></div>
                    </article>
                </div>
            </div>
            <div class="partage">
                <div class="left-partage">
                    <div class="like btn-action">
                        <p id="${cron.ID}" click="false">${Like}</p>
                        <i id-cron="${cron.ID}" class="fa ${liked}" style="color:#F970FE;"></i>
                    </div>
                    <div class="comment btn-action">
                        <p id="${cron.ID}">${Comment}</p>
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
    </div>
        `

    } else {
        newCron = `
        <div id-cron="${cron.ID}" class="article">
            <div class="user-wrapper">
                <div class="image-user">
                    <div class="user-image">
                        <img class="img-cron-user" src=""
                        alt="">
                    </div>
                </div>
                <div class="pseudo-user">${cron.creator}</div>
                <div class="options-admin">
                    <i class="fa fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="article-text">
                <div class="div-article">
                    <article class="article-area">
                        <div class="text">${cron.content}</div>
                        <div class="media"></div>
                    </article>
                </div>
            </div>
            <div class="partage">
                <div class="left-partage">
                    <div class="like btn-action">
                        <p id="${cron.ID}" click="false">${Like}</p>
                        <i id-cron="${cron.ID}" class="fa ${liked}" style="color:#F970FE;"></i>
                    </div>
                    <div class="comment btn-action">
                        <p id="${cron.ID}">${Comment}</</p>
                        <i class="fa fa-commenting"></i>
                    </div>
                    <div class="share btn-action">
                        <i class="fa fa-share-alt"></i>
                    </div>
                </div>
                <div class="right-partage">
                    <div class="time">
                    <i class="fa fa-clock-o"></i>
                    <p>${cron.timeLeft.Hour}:${cron.timeLeft.Minute} ${cron.timeLeft.Day}/${cron.timeLeft.Month}/${cron.timeLeft.Year}
                    </p>
                    </div>
                </div>
            </div>
        </div>  
        `
    }

    if (asc == 1) {
        allCron.innerHTML = newCron + allCron.innerHTML
    } else {
        allCron.innerHTML += newCron
    }

    const user = await requestUserInfo()
    const actualUser = await userExist(cron.creator)
    const allPP = Array.from(document.getElementsByClassName("img-cron-user"))
    allPP.forEach(e => {
        e.src = actualUser.ProfilPicture
    })

    if (user.Rank === "member") {
        const paramsModo = Array.from(document.getElementsByClassName('fa-ellipsis-h'))
        paramsModo.forEach(e => {
            e.style.display = 'none'
        })
    }
    if (parentCron != null) {
        const mainCron = document.getElementsByClassName('.redirect-parent')[0]
        mainCron.addEventListener('click', redirect(parentCron))
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


function redirect(event, parent) {
    event.stopPropagation()
    window.location.href = `/cron/${parent.ID}/`
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