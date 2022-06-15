let tabCron = new Map()

let users = {
    Status : "user"
}
let admin = {
    Status : "admin"
}
let modo = {
    Status : "modo"
}

let cron = []

for (let index = 0; index < 10; index++) {
    cron[index]  = `cronnner ${index}`;
}

export function Affichagetag(cron){
for (let index = 0; index < cron.length; index++) {
    TagInTab(cron[index].tag)
}
}

function TagInTab(tag){

        if (tag in tabCron) {
            let temp = tabCron.get(tag)
            tabCron.set(tag,temp+1) 
        }else{
            tabCron.set(tag,1)
        }
        
    
}