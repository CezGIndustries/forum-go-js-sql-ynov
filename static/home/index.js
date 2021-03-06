import { helloCron } from "./templateCron.js"

let NUMBER_OF_CRON = 0

document.querySelector('body').onload = async function () {
  // Function that while be load when page is load
  console.log('Page is loaded.')
  await sleep(35)
  if (document.getElementsByClassName('logoutmid')[0].textContent != "undefined") {
    document.getElementById('more').addEventListener('click', async () => {
      const cron = await printCrons()
      for (let i of cron) {
        if (i == -1) {
          document.getElementsByClassName('midcolumn')[0].removeChild(document.getElementById('more'))
          return
        }
        await sleep(10)
        drawCrons(i, -1)
      }
    })
    const cron = await printCrons()
    for (let i of cron) {
      if (i == -1) {
        document.getElementsByClassName('midcolumn')[0].removeChild(document.getElementById('more'))
        return
      }
      await sleep(10)
      drawCrons(i, -1)
    }
  } else {
    document.getElementsByClassName('midcolumn')[0].removeChild(document.getElementById('more'))
  }

}

document.getElementById('button-post').addEventListener('click', () => {
  // Button that allow user to submit a cron
  const content = document.getElementById("text-value-entry").value
  document.getElementById("text-value-entry").value = ''
  if (content !== '') {
    const timeEntry = parseInt(document.getElementById("select-time").value)
    const timeLeft = timeLeftFunciton(timeEntry, SetTime())
    const tag = content.match(/(#\w+)/gm)
    createCron(content, tag, timeLeft)
  }
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawCrons(id, asc = 1) {
  // While request and draw cron depends on if its a main cron or a comment
  const cron = await requestCron(id)
  if (cron.timeLeft.Minute < 10) {
    cron.timeLeft.Minute = String(`0${cron.timeLeft.Minute}`)
  }
  if (cron.tag === null) {
    cron.tag = ''
  }
  if (cron.Likes === null) {
    cron.Likes = []
  }
  if (cron.Comments === null) {
    cron.Comments = []
  }
  if (cron.ParentID == -1) {
    helloCron(null, cron, asc)
  } else {
    const parentCron = await requestCron(cron.ParentID)
    helloCron(parentCron, cron, asc)
  }
  NUMBER_OF_CRON += 1
  everyAddEventListener()
}

function everyAddEventListener() {
  // Add every listener to the div
  const allLikes = document.querySelectorAll('.fa-thumbs-o-up')
  const allLiked = document.querySelectorAll('.fa-thumbs-up')
  const allCronID = document.querySelectorAll('.article')
  const allShare = document.querySelectorAll('.fa-share-alt')

  for (let likes of allLikes) {
    likes.addEventListener('click', addLike)
  }
  for (let likes of allLiked) {
    likes.addEventListener('click', addLike)

  }
  for (let CronID of allCronID) {
    CronID.addEventListener('click', redirectCron)
  }
  // for (let shares of allShare) {
  //   CronID.addEventListener('click', ShareUrl)
  // }
}

async function printCrons() {
  return fetch('/cronosdb/POST/cron/MULTIPLE', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      From: Number(NUMBER_OF_CRON),
      To: Number(NUMBER_OF_CRON) + 10,
    })
  }).then((res) => {
    return res.json()
  }).then((res) => {
    if (res === null) {
      return [-1]
    }
    return res
  })
}



export function createCron(content, tag, timeLeft) {
  // Add cron to database
  fetch('/cronosdb/POST/cron/CREATE', {
    method: 'POST',
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
    if (res.ERROR == 403) {
      window.location.href = `/connexion`
    } else {
      try {
        window.location.href = "/home" // A REVOIR
      } catch {
        drawCrons(res)
      }
    }
  })
}

async function requestCron(id) {
  // Ask to database every information on a cron
  return fetch('/cronosdb/POST/cron/GET', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      id: id,
    })
  }).then((res) => {
    return res.json()
  }).then((res) => {
    return res
  })
}

function addLike(event) {
  // Like or unlike a cron, and change the like database
  event.stopPropagation()
  const id = event.srcElement.getAttribute('id-cron')
  const likeIncrement = document.getElementById(`${id}`)

  const liked = event.srcElement.classList[1] === "fa-thumbs-up"
  if (!liked) {
    event.srcElement.classList.replace('fa-thumbs-o-up', 'fa-thumbs-up')
    likeIncrement.innerText = (parseInt(likeIncrement.textContent) + 1).toString()
  } else {
    event.srcElement.classList.replace('fa-thumbs-up', 'fa-thumbs-o-up')
    likeIncrement.innerText = (parseInt(likeIncrement.textContent) - 1).toString()
  }
  return fetch('/cronosdb/POST/cron/LIKE', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      id: Number(id),
    })
  })

}



function redirectCron(event) {


  event.stopPropagation()//
  for (let i of event.path) {
    if (!(i.getAttribute('id-cron') === null)) {
      return fetch('/cronosdb/POST/cron/REDIRECT', {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          id: Number(i.getAttribute('id-cron')),
        })
      }).then((res) => {
        return res.json()
      }).then((res) => {
        if (res.ERROR != "404") {
          window.location.href = `/${res.User}/cron/${res.ID}`
        } else {
          location.reload()
        }
      })
    }
  }
}

export function SetTime() {
  // Put current time in a variable
  const timeLeft = {}
  let date = new Date()
  timeLeft.year = date.getFullYear();
  timeLeft.month = date.getMonth() + 1
  timeLeft.day = date.getDate();
  timeLeft.hour = date.getHours();
  timeLeft.minute = date.getMinutes();
  return timeLeft
}

export function timeLeftFunciton(timeLeft, timeNow) {
  // Set an end time for the cron
  const monthe30 = "4-6-9"
  const monthe31 = "1-3-5-7-8-10-12"
  timeNow.minute += timeLeft
  if (timeNow.minute >= 60) {
    timeNow.hour += Math.floor(timeNow.minute / 60)
    timeNow.minute %= 60
    if (timeNow.hour >= 24) {
      timeNow.day += Math.floor(timeNow.hour / 24)
      timeNow.hour %= 24
      while (timeNow.day > 28) {
        if (timeNow.month > 12) {
          timeNow.month = 1
          timeNow.year += 1
        } else if (timeNow.month === 8) {
          if (timeNow.day > 31) {
            timeNow.day -= 31
            timeNow.month += 1
          } else {
            break
          }
        } else if (timeNow.month === 2) {
          if (timeNow.year % 4 === 0 && (timeNow.year % 400 === 0 || timeNow.year % 100 !== 0)) {
            timeNow.day -= 29
            timeNow.month += 1
          } else {
            timeNow.day -= 28
            timeNow.month += 1
          }
        } else if (monthe30.includes(timeNow.month) || timeNow.month === 11) {
          if (timeNow.day > 30) {
            timeNow.day -= 30
            timeNow.month += 1
          } else {
            break
          }
        } else if (monthe31.includes(timeNow.month)) {
          if (timeNow.day > 31) {
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
