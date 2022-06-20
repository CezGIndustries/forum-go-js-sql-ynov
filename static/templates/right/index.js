document.addEventListener("DOMContentLoaded", async () => {
    console.log("Template right loaded")
    const famousTags = await famousTagsFetch()
    console.log(famousTags)
})

/* <div class="popular-tags">
    <p>
        #TAG
    </p>
    <p id="used">
        Utilisés 50 fois
    </p>
</div> */

async function famousTagsFetch() {
    fetch('/cronosdb/POST/tag/GET_FAMOUS_TAG', {
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