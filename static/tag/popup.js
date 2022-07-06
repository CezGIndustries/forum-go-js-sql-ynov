const element = document.querySelectorAll('.list-of-tags-content')
const confirm = document.getElementById('but')
let selec = []
const ele = document.activeElement
for (let i of element) {
    i.addEventListener("click",(e) =>{
        const div = e.srcElement
        
        if(div.getAttribute("value") === "YES"){
            div.setAttribute("value", "NO")
            div.removeAttribute("id")
            let index = selec.indexOf(div.getAttribute("tag"))
            selec.splice(index,1)
        }else if(div.getAttribute("value") === "NO"){
            div.setAttribute("value", "YES")
            div.setAttribute("id", "ON")
            selec.push(div.getAttribute("tag"))
        }
    })   
}

confirm.onclick = function(){
fetch('/')
}
