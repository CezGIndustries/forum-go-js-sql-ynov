let input = document.getElementById("postCron")
let post = document.getElementById("posts")
let id = 0

input.addEventListener("keyup",function(event){
    console.log('hi')
    if(event.keyCode == 13){
    console.log(id)
    id ++
    let val = document.querySelector('input').value
    document.querySelector('input').value = ''
    document.querySelector('input').focus()
    let Cron = document.createElement('div')
    let data = document.createTextNode(val +" "+id)
    Cron.setAttribute('class','cron')
    Cron.setAttribute('onclick','displayCron()')
    Cron.setAttribute('id',id)
    Cron.appendChild(data)
    post.after(Cron)
    console.log(val + id)
}
});

function displayCron(){
    
    console.log(event.srcElement.id)
}