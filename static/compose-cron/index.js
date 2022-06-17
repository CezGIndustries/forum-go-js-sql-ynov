
document.getElementById('button-post').addEventListener('click', () => {
    // Button that allow user to submit a cron
    const content = document.getElementById("text-value-entry").value
    document.getElementById("text-value-entry").value = ''
    console.log(content)
    if(content !== '') {
        const timeEntry = parseInt(document.getElementById("select-time").value)
        const timeLeft = timeLeftFunciton(timeEntry, SetTime())
        const tag = content.match(/(#\w+)/gm)
        createCron(content, tag, timeLeft)
        
    }
})

document.addEventListener("DOMContentLoaded", async () => {
    
    // Function that while be load when page is load
    console.log("Template is loaded.")
    const user = await requestUserInfo()
    // console.log(user)

    // const img = document.querySelector('img')
    // img.src = user.ProfilPicture


    const backHome = document.getElementsByClassName('fa-space-shuttle')
    for(let i of backHome) {
        i.addEventListener('click', () => {
            window.location.href = `/home`
        })
    }

    const post = document.getElementsByClassName("button")
   
})

//already used juste repeat//

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
        // drawCrons(res)
        console.log('good !')
      }
    })
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
  