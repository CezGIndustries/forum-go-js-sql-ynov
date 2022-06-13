async function drawCrons(id) {
    const cron = await requestCron(id)
    console.log(cron)
    const mainCron = document.querySelector('.div-all-article')
  
    const newCrone = document.createElement('div')
  
    newCrone.setAttribute('cron-id', cron.ID.toString() )
    newCrone.classList.add('div-article')
  
    const article = document.createElement('article')
    article.classList.add('article')
    article.setAttribute('id', 'test')
    article.innerText =cron.Creator +" --- "+ cron.Content +" --- Finish Time -"+ cron.TimeLeft.Year +"/"+ cron.TimeLeft.Month+"/"+ cron.TimeLeft.Day+"/"+cron.TimeLeft.Hour+"/"+cron.TimeLeft.Minute +" --- "+ cron.Tag
  
  
    
    // const divLike = document.createElement('div')
    // divLike.classList.add('btn')
    // divLike.setAttribute('id', 'like')
     
    // const divComment = document.createElement('div')
    // divComment.classList.add('btn')
    // divComment.setAttribute('id', 'comment')
    const lastElement = document.getElementById('start')
    lastElement.after(newCrone)
    newCrone.append(article)
    
    document.querySelector('textarea').value = ''
      
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