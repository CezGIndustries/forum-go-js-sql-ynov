const why = document.getElementById('why')
const email = document.getElementById('email')
const errorWhy = document.getElementById('error-why')
const errorEmail = document.getElementById('error-email')

document.getElementById('which-contact').addEventListener('change', () => {
    const report = document.getElementById('which-contact').value
    document.getElementById('div-complementary').style.visibility = 'visible'
    why.value = ''
    switch (report) {
        case 'help':
            why.placeholder = "Dites-nous la raison pour laquelle vous avez besoin d'aide"
            break
        case 'report':
            why.placeholder = "Qui est l'utilisateur que vous voulez signaler et pourquoi"
            break
        case 'bug':
            why.placeholder = "Signaler la page (voir copier-coller le lien ici) afin qu'on puisse régler le problème"
            break
        case 'contact':
            why.placeholder = "En quoi pouvons-nous vous aider ?"
            break
        default:
            document.getElementById('div-complementary').style.visibility = 'hidden'
    }
})

document.getElementById('submit').addEventListener('click', () => {
    errorWhy.style.display = 'none'
    errorEmail.style.display = 'none'
    if (why.value.match(/^\s+\w|\w/gi) === null) {
        errorWhy.style.display = 'block'
        return
    }
    if (noValidateEmail(email.value)) {
        errorEmail.style.display = 'block'
        return
    }
    why.value = why.value.replace(/\s+/gi, " ")

    fetch('/cronosdb/POST/contact/REQUEST', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            content: why.value,
            mail: email.value,
        })
    })

    why.value = ''
    email.value = ''
})

function noValidateEmail(email) {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === null
}