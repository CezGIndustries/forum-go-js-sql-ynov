
async function drawCrons(id) {
  const cron = await requestCron(id)
  console.log(cron)
  const mainCron = document.querySelector('.div-all-article')

  const article = document.createElement('div')
  article.classList.add('article')

  const userWrapper = document.createElement("div")
  userWrapper.classList.add('user-wrapper')
  
  const imageUser = document.createElement("div")
  imageUser.classList.add('image-user')

  const img = document.createElement("img")
  img.src = "../img/profil_pictures/1.png"

  const pseudoUser = document.createElement("div")
  pseudoUser.classList.add('pseudo-user')
  pseudoUser.innerText = cron.Creator

  const optionAdmin = document.createElement("div")
  optionAdmin.classList.add('options-admin')
  
  const i = document.createElement("i")
  i.classList.add('fa fa-ellipsis-h')

  const articleText = document.createElement("div")
  articleText.classList.add('article-text')
  
  const divArticle = document.createElement("div")
  divArticle.classList.add('div-article')

  const articleArea = document.createElement("articles")
  articleArea.classList.add('article-area')
  articleArea.innerText = cron.Content

  const partage = document.createElement("div")
  partage.classList.add('partage')

  const videGauche = document.createElement("div")
  videGauche.classList.add('vide-gauche')

  const like = document.createElement("div")
  like.classList.add('like')

  const iLike = document.createElement("i")
  iLike.classList.add('fa fa-thumbs-o-up')

  const share = document.createElement("div")
  share.classList.add('share')

  const iShare = document.createElement("i")
  iShare.classList.add('fa fa-share-alt')

  const save = document.createElement("div")
  save.classList.add('save')

  const iSave = document.createElement("i")
  iSave.classList.add('fa fa-bookmark-o')

  const videDroite = document.createElement("div")
  videDroite.classList.add('vide-droite')

  const time = document.createElement("div")
  time.classList.add('time')

  const iTime = document.createElement("i")
  iTime.classList.add('fa fa-clock-o')
  iTime.innerText = "TimeLeft"


  article.append(userWrapper)

  userWrapper.append(imageUser)
  imageUser.append(img)

  userWrapper.append(pseudoUser)
  userWrapper.append(optionAdmin)
  optionAdmin.append(i)

  article.append(articleText)
  articleText.append(divArticle)
  divArticle.append(articleArea)

  userWrapper.append(partage)
  partage.append(videGauche)
  partage.append(like)
  like.append(iLike)

  partage.append(share)
  share.append(iShare)

  partage.append(save)
  save.append(iSave)

  partage.append(videDroite)

  partage.append(time)
  time.append(iTime)

  
  mainCron.append(article)
  
 
    
  //Event if click on cron//
  // newCrone.addEventListener('click', event => {
  //   //create request for redirect on cron//
  //   const id = newCrone.getAttribute('cron-id')
  //   requestRedirectCron(id)
  //     //-------//
  //   }); 
  
    //Event if click on like//
    // divLike.addEventListener('click', event => {
    // //create request for add like and delete like//
    // const id = newCrone.getAttribute('cron-id')
    // requestLikePost(id)
    // //-------//
    // }); 
  
  //Event if click on comment//
  // divComment.addEventListener('click', event => {
  //   //create request for redirect and comment cron//
  //   const id = newCrone.getAttribute('cron-id')
  //   requestRedirectCron(id)
  //   //-------//
  // }); 
  
  return newCrone
}