const onglets = document.querySelectorAll('.onglet');
const contenu = document.querySelectorAll('.contenu');

let users = document.getElementById('banned')
const user = {
    name: 'phillippe',
    id: 1,
    status: banned,
};


let index = 0;
if (user.status == banned) {
    document.getElementById("banned").innerHTML = user.name;
    users.onclick = () => {
        console.log(user.status)
        user.status = null;

    }
}


onglets.forEach(onglet => {
    onglet.addEventListener('click', () => {
        if (onglet.classList.contains('active')) {
            return
        } else {
            onglet.classList.toggle('active')
        }

        index = onglet.getAttribute('data-anim');
        console.log(index)

        for (let i = 0; i < onglets.length; i++) {

            if (onglets[i].getAttribute('data-anim') != index) {
                onglets[i].classList.remove('active');
            }
        }

        for (let j = 0; j < contenu.length; j++) {
            if (contenu[j].getAttribute('data-anim') == index) {
                contenu[j].classList.add('activeContenu')
            } else {
                contenu[j].classList.remove('activeContenu');

            }
        }
    })
})


