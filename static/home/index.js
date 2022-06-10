document.querySelector('body').onload = function(){
  console.log('Page-load...')  
  //Create request for draw cron when onload page//
  
  //-------//
}

const button = document.getElementById('button-post');  
//Click and create cron if all conditons true//
button.addEventListener('click', () => {
  const content = document.getElementById("text-value-entry").value
  const tag = tagExist(content)
  if(content !== '') {
    const timeEntry = parseInt(document.getElementById("select-time").value)
    timeLeft = timeLeftFunciton(timeEntry, SetTime())
    if(tag !== null) {
      createCrone(content, tag.join(' '), timeLeft)
    } else {
      createCrone(content, tag, timeLeft)
    }
  } else {
    console.log('err: missing content, time or tag')
  }
});  
  
//fonction for cron creation//
async function drawCrons(id) {
  const cron = await requestCron(id)
  console.log(cron)
  const mainCron = document.querySelector('#user-post')
  const newCrone = document.createElement('div')

  newCrone.classList.add('cron')
  newCrone.setAttribute('cron-id', id.toString() )
  
  const cronContent = document.createElement('p')
  cronContent.classList.add('cron-content')
 
  const cronTime = document.createElement('p')
  cronTime.classList.add('cron-time')
  
  const divLike = document.createElement('div')
  divLike.classList.add('btn')
  divLike.setAttribute('id', 'like')
   
  const divComment = document.createElement('div')
  divComment.classList.add('btn')
  divComment.setAttribute('id', 'comment')
  
  mainCron.after(newCrone)
  newCrone.append(cronContent)
  newCrone.append(cronTime)
  newCrone.append(divLike)
  newCrone.append(divComment)
  
  document.querySelector('textarea').value = ''
    
  //Event if click on cron//
  newCrone.addEventListener('click', event => {
    //create request for redirect on cron//
    const id = newCrone.getAttribute('cron-id')
    requestRedirectCron(id)
      //-------//
    }); 
  
    //Event if click on like//
    divLike.addEventListener('click', event => {
    //create request for add like and delete like//
    const id = newCrone.getAttribute('cron-id')
    requestLikePost(id)
    //-------//
    }); 
  
  //Event if click on comment//
  divComment.addEventListener('click', event => {
    //create request for redirect and comment cron//
    const id = newCrone.getAttribute('cron-id')
    requestRedirectCron(id)
    //-------//
  }); 
  
  return newCrone
}
  
//Request for create cron//
function createCrone(content, tag, timeLeft){
  fetch('/chronosdb/POST/cron/CREATE' , {
    method:'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      content:content,
      timeLeft:timeLeft,
      tag:tag,
      parentID: -1,
    })
  }).then((res) => {
    return res.json()
  }).then((res) => {
    drawCrons(res.ID)
  })
}
    

async function requestCron(id){
  // Get every information of the cron with the database
  return fetch('/chronosdb/POST/cron/GET' , {
    method:'POST',
    headers: {
        "content-type": "application/json"
    },
    body: JSON.stringify({
      id: id,
    })
  }).then((res) => {
    return res.json()
  }).then((res) =>{
    return res
  })
}

//Request onload page//
function requestOnLoadPage(){
  fetch('/route/',{
    method:'POST',
    headers: {
      "content-type": "application/json"
  },
  body: JSON.stringify({
    content: "ONLOAD-PAGE",
  })
  }).then((res) => {
    return res.json()
  }).then((res) =>{
    comment.user = res.user
  })
}
  
//Request if you like cron//
function requestLikePost(id){
  fetch('/route/',{
    method:'POST',
    headers: {
      "content-type": "application/json"
  },
  body: JSON.stringify({
    id: id,
  })
  }).then((res) => {
    return res.json()
  }).then((res) =>{
    like.user = res.user
  })
}
 
//request for redirect if click or if you want comment//
function requestRedirectCron(id){
  fetch('/route/',{
    method:'POST',
    headers: {
      "content-type": "application/json"
  },
  body: JSON.stringify({
    id: id,
    })
  })
}

//Set time now //
function SetTime(){
  const timeLeft = {}
  let date = new Date()
  timeLeft.year = date.getFullYear();
  timeLeft.month =  date.getMonth()+1
  timeLeft.day =  date.getDate();
  timeLeft.hour = date.getHours();
  timeLeft.minute = date.getMinutes();
  return timeLeft
}

//Calc time left with time entry //
function timeLeftFunciton(timeLeft, timeNow){
  const monthe30 = "4-6-9" //not 11 but one is it also month31
  const monthe31 = "1-3-5-7-8-10-12"
  timeNow.minute += timeLeft
  if(timeNow.minute >= 60) {
    timeNow.hour += Math.floor(timeNow.minute / 60)
    timeNow.minute %= 60
    if(timeNow.hour >= 24) {
      timeNow.day += Math.floor(timeNow.hour / 24)
      timeNow.hour %= 24
      while(timeNow.day > 28) {
        if(timeNow.month > 12) {
          timeNow.month = 1
          timeNow.year += 1
        } else if(timeNow.month === 8) {
          if(timeNow.day > 31) {
            timeNow.day -= 31
            timeNow.month += 1
          } else {
            break
          }
        } else if(timeNow.month === 2) {
          if(timeNow.year % 4 === 0 && (timeNow.year % 400 === 0 || timeNow.year % 100 !== 0)) {
            timeNow.day -= 29
            timeNow.month += 1
          } else {
            timeNow.day -= 28
            timeNow.month += 1
          }
        } else if(monthe30.includes(timeNow.month) || timeNow.month === 11) {
          if(timeNow.day > 30) {
            timeNow.day -= 30
            timeNow.month += 1
          } else {
            break
          }
        } else if(monthe31.includes(timeNow.month) ) {
          if(timeNow.day > 31) {
            timeNow.day -= 31
            timeNow.month += 1
          } else {
            break
          }
        }
      }
    }
  }
  return timeNow
}

function tagExist(textarea){
  if(textarea.includes("#")){
    let pattern = /(#\w+)/gm;
    return textarea.match(pattern)
  }
  return null
}