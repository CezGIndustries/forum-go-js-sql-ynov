document.addEventListener("DOMContentLoaded", async () => {
    console.log("Template right loaded")
    const famousTags = await famousTagsFetch()
    tagFamous = []
    for (const [key, value] of Object.entries(famousTags)) {
        tagFamous.push([key, value])
    }
    tagFamous.sort(function (a, b) {
        return b[1] - a[1]
    })
    const divTags = document.getElementById('tags')
    divTags.innerHTML = ""
    for (let i = 0; i < 5 && i < tagFamous.length; i++) {
        divTags.innerHTML += `
        <div class="popular-tags">
            <p>
                ${tagFamous[i][0]}
            </p>
            <p id="used">
                Utilisés ${tagFamous[i][1]} fois
            </p>
        </div>
        `
    }

    const valide = document.getElementById('redirect-user')
  
    valide.addEventListener('click', e => {
        const valueInput = document.getElementById('research').value
        console.log(valueInput[0])
        if(valueInput != null){
            if(valueInput[0] == "@"){
                window.location.href = `/profil/${valueInput.replace("@", "")}`
            }else if (valueInput[0] == "#"){
                window.location.href = `/error`
            }else{
                alert("recherche err: élément manquant @ ou # ")
            }
        }else{
            alert("recherche err: null")
        }
        document.getElementById('research').value = ""


        
    })
      





})

async function famousTagsFetch() {
    return fetch('/cronosdb/POST/tag/GET_FAMOUS_TAG', {
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