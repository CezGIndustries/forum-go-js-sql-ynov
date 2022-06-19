export async function soloCron(cron, asc) {
    let liked = 'fa-thumbs-o-up'
    if (cron.Likes.includes(document.getElementsByClassName('logoutmid')[0].textContent)) {
        liked = "fa fa-thumbs-up"
    }
    const allCron = document.querySelector('.div-all-article')
    const Like = cron.Likes.length
    const Comment = cron.Comments.length
    // const urlYtb = cron.content.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)
    // console.log(urlYtb[0])
    const newCron = `
    <div id-cron="${cron.ID}" class="article">
        <div class="user-wrapper">
            <div class="image-user">
                <div class="user-image">
                    <img src="data:image/jpeg;base64,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"
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
                    <div class="text">
                        ${cron.content}
                    <div>
                    <div class="media">

                    <div>
                
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
                    <p>${cron.timeLeft.Hour}:${cron.timeLeft.Minute} ${cron.timeLeft.Day}/${cron.timeLeft.Month}/${cron.timeLeft.Year}</p>
                </div>
            </div>
        </div>
    </div>  
    `
    if (asc == 1) {
        allCron.innerHTML = newCron + allCron.innerHTML
    } else {
        allCron.innerHTML += newCron
    }
}

export async function parentToChildCron(parentCron, childCron, asc) {
    const allCron = document.querySelector('.div-all-article')
    const newCron = `
    <div id-cron="${parentCron.ID}" class="article">
        <div class="user-wrapper">
            <div class="image-user">
                <div class="user-image">
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHwAhwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADQQAAEEAQMCAwYFAwUAAAAAAAEAAgMRBAUSITFBBlFhExQicZGhMkKBscEj0eElM1JTcv/EABoBAQADAQEBAAAAAAAAAAAAAAADBAUCAQb/xAAhEQADAAMAAgIDAQAAAAAAAAAAAQIDBBESITFBEyJRcf/aAAwDAQACEQMRAD8A+4oiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiALFrKpNZzy2f3aM1Qt36qPLlWKfJneOHdcRPlz42GmAvPcjotY1Nv5oyB6G1UY8pJonlSbBKoLbuvaLT15n0y4hyY5h/TcCe47raucfYO5pII6EcKZg6pREeT+j/wC6nxbap8r0RXgaXZLhFgEEAjoVlXCuEREAREQBERAEReJJGxtLnuAAQHsrw+RjBb3AD1KrMjUHvNRfC3z7qGT3c4k+ZVTJtTPwTzgb+S7OZj/9gXJ62/8A1l743gse1p/j+FInyGtCpczM9pO0nsaWdtbf5I8S5g1/CvItMQgOJJJLj3U8EVd8KkxJtxAKtYX7m0Oyq4b6TZJ+yPnZksLyGRF/F8LXCZ3xh7w0bvygdFIEVTOkIdwPqpFU2wpONv2znySXD3p2oOxyI5bdF9wr9j2vaHMILTyCO65V9El1EdlI0zUTjSiKU/0nHr/xV3V2uPworZsHf2k6RFgEEWDwsrVKIREQBEWjLmGPjyTH8jbXjaS6wl30a8zNjxvh/E89Gj+VUzTSTuD3knyb2CgMlfNK6V5JLnKUX7QSSa9SsfJtvJ8ekaMYFH+h79o4FqO+cHuvEs1ktavDIHOsu+G/Icqq7dPiJ1KS9kfKdxdqmziKNFdR7tEPxsa4gfnQ48DyWGKKx1G0FcVgb+ztZUjmtOyvat604cK9xJ6PP3STScQuL2wsjcRyWDb+yjS474OWu3NCi/HcPp06m0XTXhw4WvcSTx8PZV+PlxvppNkc0prZg9poUR91OqTRC54YedxIHbuVFm5sVVdD5rbJJR5CjZDwQLKjdHaRfaBqBe33aY8gfAb+yvFwMEjoXtfG6nNduBXc48onhZK3o8Ara0szuPF/KM7Zxqa6vs2oiK8VgqnxI4jT6HeQAq2UHWcY5WnTRsFvA3NHqFFnl1jpL+HeNpWmzkodQx8cESvAPa1vky2SR3GQQfIqjzcGOfmQH1te8JksGLtO0v52+QC+eaXOGxwsmXyRW93euin49qvw2nYN/wCPurGItFAnk9F7FfSObPTnclpbwR+I9FqOQ1jyC3mrLuy9OcAzkjd3pQZpADyeV5dtHkybDm7i4WCAeOFqdIX2DXPSlEfIAeKC8CQgcm1E7bZJ4oYzZGzSwSAuaPijd2ry+a2wZb4ZjHIef3Xkv3N6quzdzC15dYDqtd17XUC6fMXXz8itEsg72VFx3F7BZ5HkpLGFwNmvkinyZy2kAfio8LtdCJOmQ36/uuQZA9+U1wJ2gUGjuV3GFD7vjRxd2to/NaujDVNlLapNJG9ERaZSCxSyiA53XtJjkLpYTte425vYlUkWOI2tbXLRVrtciD2oXOajiGHMBI4Itvr5rI3sCleco0NXL39WyMwBvXqvcuSWR7W0CVHfiP8AeXzOmOxwoRjoPVeGBzWEPN0eCfJZyf8AC3xHkzHuVom+M3aSEXwgXng2OmktsrBaR0UivktTIdshLncLpQedNcUT2k2Sb6Kr8R5PuuJG0gnc6ya6Af5V+XNa07QXHyHdcxqun5+dM4uaSDwAOwVrHh6ukbvg03Vow2y4fqrCXUPeGexxid7+DsPP1VNh+DZHu3PbMPQOXVaN4TGKQWhwPqVLGszisqL7w9jCBrJJyHSgcAchv9yuojO5tqt0/A9i0blZgUKC1McKZ4jPyV5V0yiIpDgIiIAVX6nEyeEh3Dhy0+RVgomTC54NKPJKqeM7h8fTkpZ/ZvLJCAQfqtEmRGOrgrzM0kT37SO77qmyPB2NMeWvr/0smtFp/qaE7C57KnL1TDx/92eNo9XAKBJ4kw2kbZWOHm02r2PwHp7Xbvd2k+ZCn4/g/DZVQs+i7WnR49iTkG+IY5HVjQyyE9wwgfdSoZc/KPMRa1dvj+HMeOqiaP0VhDpMMf5R9FNOokRVsI43DwspxFggK+wdN6b2hX7MSJo4aPotzWNaKACtxi8SCsvSHBhRsA+EWpTYWN6BbEUqRE2YApZRF6eBERAEREAWCLWUQGNoWNoXpE4DzsCztCyicBillEQBERAEREAREQBERAf/2Q=="
                    alt="">
                </div>
            </div>
            <div class="pseudo-user">pseudo</div>
            <div class="options-admin">
                <i class="fa fa-ellipsis-h"></i>
            </div>
        </div>
        <div class="article-text">
            <div class="div-article">
                <article class="article-area">${parentCron.tag}    ${parentCron.content}</article>
            </div>
        </div>
        <div class="partage">
            <div class="vide-gauche"></div>
            <div class="like">
                <i id-cron="${parentCron.ID}" class="fa fa-thumbs-o-up"></i>
            </div>
            <div class="comment">
                <i class="fa fa-commenting"></i>
            </div>
            <div class="share">
                <i class="fa fa-share-alt"></i>
            </div>
            <div class="vide-droite"></div>
            <div class="time">
                <i class="fa fa-clock-o">TimeLeft</i>
            </div>
        </div>
        <div id-cron="${childCron.ID}" class="div-child">
            <div class="draw-coin"></div>
            <div class="article-child">
                <div class="user-wrapper">
                    <div class="image-user">
                        <div class="user-image">
                            <img src="data:image/jpeg;base64,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"
                            alt="">
                        </div>
                    </div>
                    <div class="pseudo-user">PseudoPseudoPseudoPseudoPseudoPs</div>
                    <div class="options-admin">
                        <i class="fa fa-ellipsis-h"></i>
                    </div>
                </div>
                <div class="article-text">
                    <div class="div-article">
                        <article class="article-area">${childCron.tag}    ${childCron.content}</article>
                    </div>
                </div>
                <div class="partage">
                    <div class="vide-gauche"></div>
                    <div class="like">
                        <i id-cron="${childCron.ID}" class="fa fa-thumbs-o-up"></i>
                    </div>
                    <div class="share">
                        <i class="fa fa-share-alt"></i>
                    </div>
                    <div class="vide-droite"></div>
                </div>
            </div>
        </div>
    </div>
    `
    if (asc == 1) {
        allCron.innerHTML = newCron + allCron.innerHTML
    } else {
        allCron.innerHTML += newCron
    }
}

export async function grantParentToParentToChildCron(fatherCron, parentCron, childCron, asc) {
    const allCron = document.querySelector('.div-all-article')
    const newCron = `
    <div id-cron="${fatherCron.ID}" class="article">
        <div class="child-to-child">
            <div class="child-to-child-top">
                <div class="user-image">
                    <img src="data:image/jpeg;base64,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"
                        alt="">
                </div>
                <div class="pseudo-user">${fatherCron.creator}</div>
                <p class="redirect-parent">Discussion</p>
            </div>
            <div class="child-to-child-bot">
                <div class="left-coin"><div class="ligne"></div></div>
            </div>
        </div>
        <div class="user-wrapper">
            <div class="image-user">
                <div class="user-image">
                    <img src="data:image/jpeg;base64,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"
                        alt="">
                </div>
            </div>
            <div class="pseudo-user">${parentCron.creator}</div>
            <div class="options-admin">
                <i class="fa fa-ellipsis-h"></i>
            </div>
        </div>
        <div class="article-text">
            <div class="div-article">
                <article class="article-area">${parentCron.tag}    ${parentCron.content}</article>
            </div>
        </div>
        <div class="partage">
            <div class="vide-gauche"></div>
            <div class="like">
                
                <i id-cron="${parentCron.ID}" class="fa fa-thumbs-o-up"></i>
            </div>
            <div class="comment">
                <i class="fa fa-commenting"></i>
            </div>
            <div class="share">
                <i class="fa fa-share-alt"></i>
            </div>
            <div class="vide-droite"></div>
        </div>
        <div id-cron="${childCron.ID}"  class="div-child">
            <div class="draw-coin"></div>
            <div class="article-child">
                <div class="user-wrapper">
                    <div class="image-user">
                        <div class="user-image">
                            <img src="data:image/jpeg;base64,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"
                                alt="">
                        </div>
                    </div>
                    <div class="pseudo-user">${childCron.creator}</div>
                    <div class="options-admin">
                        <i class="fa fa-ellipsis-h"></i>
                    </div>
                </div>
                <div class="article-text">
                    <div class="div-article">
                        <article class="article-area">${childCron.tag}    ${childCron.content}</article>
                    </div>
                </div>
                <div class="partage">
                    <div class="vide-gauche"></div>
                    <div class="like">
                        <i id-cron="${childCron.ID}" class="fa fa-thumbs-o-up"></i>
                    </div>
                    <div class="comment">
                        <i class="fa fa-commenting"></i>
                    </div>
                    <div class="share">
                        <i class="fa fa-share-alt"></i>
                    </div>
                    <div class="vide-droite"></div>
                </div>
            </div>
        </div>
    </div>
    `
    if (asc == 1) {
        allCron.innerHTML = newCron + allCron.innerHTML
    } else {
        allCron.innerHTML += newCron
    }
}

