let input = document.getElementById("postCron")
let post = document.getElementById("posts")
let id = 0

const cronObj = {
    id: '',
    image:'',
    time:'',
    content:'',
    like:111,
    comment:0,
    partage:0
}

input.addEventListener("keyup",function(event){
    if(event.keyCode == 13){
    createDiv()      
    }
});

function displaycron(){
    
    console.log(event.srcElement.id)
}

function createDiv(){
    const val = document.querySelector('input').value
    document.querySelector('input').value = ''
    document.querySelector('input').focus()
    const cron = document.createElement('div')
    let data = document.createTextNode(val +" "+id +cronObj.like)
    cron.setAttribute('class','cron')
    cron.setAttribute('onclick','displayCron()')
    cron.setAttribute('id',id)
    cron.appendChild(data)
    post.after(cron)
    console.log(val + id)

}
