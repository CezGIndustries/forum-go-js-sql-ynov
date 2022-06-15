import { grantParentToParentToChildCron, parentToChildCron, soloCron } from "./templateCron.js"

document.querySelector('body').onload = function() {
  // Function that while be load when page is load
  
  console.log('Page is loaded.')
}

function requestUserInfo() {
  // Get user info for the template
  fetch('/route/',{
      method:'POST',
      headers: {
        "content-type": "application/json"
  }}).then((res) => {
      return res.json()
  }).then((res) => {
      // METTRE USER IFNO
  })
}

document.getElementById('button-post').addEventListener('click', () => {
  // Button that allow user to submit a cron
  const content = document.getElementById("text-value-entry").value
  document.getElementById("text-value-entry").value = ''
  if(content !== '') {
      const timeEntry = parseInt(document.getElementById("select-time").value)
      const timeLeft = timeLeftFunciton(timeEntry, SetTime())
      const tag = content.match(/(#\w+)/gm)
      createCron(content, tag, timeLeft)
  }
})

async function drawCrons(id) {
  const cron = await requestCron(id)
  if(cron.ParentID == -1) {
    soloCron(cron)
  } else {
    const parentCron = await requestCron(cron.ParentID)
    if(cron.ParendID == -1) {
      parentToChildCron(parentCron, cron)
    } else {
      let fatherCron = await requestCron(parentCron.ParentID)
      while(fatherCron.ParendID != -1) {
        fatherCron = await requestCron(fatherCron.ParentID)
      }
      grantParentToParentToChildCron(fatherCron, parentCron, cron)
    }
  }
  everyAddEventListener()
}

function everyAddEventListener() {
  const allLikes = document.querySelectorAll('.fa-thumbs-o-up')
  const allCronID = document.querySelectorAll('.article')
  for(let likes of allLikes) {
    likes.addEventListener('click', addLike)
  }
  for(let CronID of allCronID) {
    CronID.addEventListener('click', redirectCron)
  }
} 

function createCron(content, tag, timeLeft) {
  // Add cron to database
  fetch('/cronosdb/POST/cron/CREATE', {
    method:'POST',
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
    if(res.ERROR == 403) {
      window.location.href = `/connexion`
    } else {
      drawCrons(res)
    }
  })
}

async function requestCron(id) {
  // Ask to database every information on a cron
  return fetch('/cronosdb/POST/cron/GET' , {
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

function addLike(event) {
  // Like or unlike a cron, and change the like database

  // AJOUTER OU ENLEVER LIKE EN JS

  event.stopPropagation()
  const id = event.srcElement.getAttribute('id-cron')
  return fetch('/cronosdb/POST/cron/LIKE' , {
    method:'POST',
    headers: {
        "content-type": "application/json"
    },
    body: JSON.stringify({
    id: Number(id),
    })
  })
}

function createComment(content, tag, parendID) {
  // Add cron comment to database
  fetch('/cronosdb/POST/cron/CREATE', {
    method:'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      content: content,
      timeLeft: {
          year: 0
      },
      tag: tag,
      parentID: parendID,
    })
  }).then((res) => {
    return res.json()
  }).then((res) => {
      // drawCrons(res.ID)
      // A VOIR
  })
}

function redirectCron(event) {
  // Redirect on cron if cron exist
  for(let i of event.path) {
    if(!(i.getAttribute('id-cron') === null)) {
      return fetch('/cronosdb/POST/cron/REDIRECT',{
        method:'POST',
        headers: {
          "content-type": "application/json"
      },
      body: JSON.stringify({
        id: Number(i.getAttribute('id-cron')),
        })
      }).then((res) => {
          return res.json()
      }).then((res) => {
          if(res.ERROR != "404") {
            window.location.href = `/${res.User}/cron/${res.ID}`
          } else {
            location.reload()
          }
      })
    }
  }
}

function SetTime() {
  // Put current time in a variable
  const timeLeft = {}
  let date = new Date()
  timeLeft.year = date.getFullYear();
  timeLeft.month =  date.getMonth()+1
  timeLeft.day =  date.getDate();
  timeLeft.hour = date.getHours();
  timeLeft.minute = date.getMinutes();
  return timeLeft
}

function timeLeftFunciton(timeLeft, timeNow) {
  // Set an end time for the cron
  const monthe30 = "4-6-9"
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