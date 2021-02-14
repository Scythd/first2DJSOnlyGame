
let Goblin = function () {
    this.damage = 2;
    this.hp = 15;
    this.speed = METER*0.02;
    this.x = 1280;
    this.width = 0.4*METER;
    this.range = 0.6*METER;
    this.height = 1.8*METER;
    this.hitcd = 0;
    this.direction = 0;
    this.walk = 0;
};
let Troll = function () {
    this.damage = 5;
    this.hp = 30;
    this.speed = METER*0.01;
    this.x = 1280;
    this.width = 1*METER;
    this.range = 0.8*METER;
    this.height = 1.8*METER;
    this.hitcd = 0;
    this.direction = 0;
    this.walk = 0;
};
let Orc = function () {
    this.damage = 10;
    this.hp = 60;
    this.speed = METER*0.02;
    this.x = 1280;
    this.width = 0.7*METER;
    this.range = 3*METER;
    this.height = 1.8*METER;
    this.hitcd = 0;
    this.direction = 0;
    this.walk = 0;
}

function enemyupdate (enemy){
    if (enemy.hitcd > 0)
        enemy.hitcd++;
    

    if (player.x + player.width <= enemy.x){
        if (player.state == 2 && player.direction == 1){
            if (player.x + player.width + 40 <= enemy.x)
                enemy.x -= enemy.speed;
        }
        else 
            enemy.x -= enemy.speed;
        enemy.direction = 0;
        enemy.walk++;
    } else {
        if (enemy.x + enemy.width <= player.x) {
            if (player.state == 2  && player.direction == 0){
                if (enemy.x + enemy.width + 40 <= player.x)
                    enemy.x += enemy.speed;
            }
            else
                enemy.x += enemy.speed;
            enemy.direction = 1;
            enemy.walk++;
        } else {
                enemy.walk = 0;
                ehit(enemy);
        }
    }


    if (player.state == 2){
        if ((player.x+player.width+30>enemy.x) && (player.direction == 1) && (player.x+player.width+30-enemy.x < METER*0.4)){ // the const in first bool is shield dx 
            enemy.x = player.x+player.width+30;
        }
        if ((player.x-30-enemy.width<enemy.x)&&(player.direction == 0) && (player.x-30-enemy.width-enemy.x > METER*-0.4)){
            enemy.x = player.x-enemy.width-30;
        }
    }


    if (enemy.damage == 2 && enemy.hitcd > 24){
        if ((player.x+player.width+enemy.range > enemy.x) && (enemy.width+enemy.x+enemy.range > player.x)){
            if ((player.state == 2 && player.direction == enemy.direction)||(player.state != 2)){
                player.hp -= enemy.damage; 
            } 
        }  
        enemy.hitcd = 0;
        enemy.speed = METER*0.02;
    } 
    if (enemy.damage == 5 && enemy.hitcd > 49){
        if ((player.x+player.width+enemy.range > enemy.x) && (enemy.width+enemy.x+enemy.range > player.x)){
            if ((player.state == 2 && player.direction == enemy.direction)||(player.state != 2)){
                player.hp -= enemy.damage; 
            } 
        }   
        enemy.hitcd = 0;
        enemy.speed = METER*0.01;
    } 
    if (enemy.damage == 10 && enemy.hitcd > 59){
        if ((player.x+player.width+enemy.range > enemy.x) && (enemy.width+enemy.x+enemy.range > player.x)){
            if ((player.state == 2 && player.direction == enemy.direction)||(player.state != 2)){
                player.hp -= enemy.damage; 
            } 
        }   
        enemy.hitcd = 0;
        enemy.speed = METER*0.02;
    }
} 

function ehit (enemy) {
    if (enemy.hitcd == 0){
        enemy.hitcd = 1;
        enemy.speed = METER*0;
    }      
}

function enemyrender (enemy){   // anim on hotcd
    /*
    if (enemy.damage == 2)
        Context.context.fillStyle = "#0000aa";
    if (enemy.damage == 5)
        Context.context.fillStyle = "#aa00aa";
    if (enemy.damage == 10)
        Context.context.fillStyle = "#aa0000";
    Context.context.fillRect(enemy.x, 300, enemy.width, enemy.height);
*/ ////// enemyhitbox //////////////////////////////////////

    if (enemy.damage == 2){
        if (enemy.hitcd > 0){
            if (enemy.direction == 0)
                Context.context.drawImage(imgGoblin, (Math.floor(enemy.hitcd%24/5)+5)*65, 3*65, 50, 65, enemy.x-55, 327, enemy.width+65, enemy.height+40);
            else
                Context.context.drawImage(imgGoblin, 10+(Math.floor(enemy.hitcd%24/5)+5)*65, 1*65, 50, 65, enemy.x-15, 327, enemy.width+85, enemy.height+40);
        } else {
            if (enemy.direction == 0)
                Context.context.drawImage(imgGoblin, 10+Math.floor(enemy.walk%29/5)*65, 3*65, 50, 65, enemy.x-45, 327, enemy.width+75, enemy.height+40);
            else
                Context.context.drawImage(imgGoblin, 10+Math.floor(enemy.walk%29/5)*65, 1*65, 50, 65, enemy.x-15, 327, enemy.width+90, enemy.height+40);
        }
    }
    if (enemy.damage == 5){
        if (enemy.hitcd > 0){
            if (enemy.direction == 0)
                Context.context.drawImage(imgTroll, 15+ Math.floor((49-enemy.hitcd)%49/5)*300, 3*300, 295, 300, enemy.x-110, 140, enemy.width+200, enemy.height+230);
            else
                Context.context.drawImage(imgTroll,  Math.floor((enemy.hitcd+30)%49/5)*300, 2*300, 295, 285, enemy.x-75, 170, enemy.width+200, enemy.height+230);
        } else {
            if (enemy.direction == 0)
                Context.context.drawImage(imgTroll, -15 + Math.floor(enemy.walk%50/5)*300, 1*295, 300, 250, enemy.x-110, 270, enemy.width+190, enemy.height+170);
            else
                Context.context.drawImage(imgTroll, Math.floor(enemy.walk%50/5)*300, 0*295, 300, 250, enemy.x-40, 280, enemy.width+190, enemy.height+170);
        }
    }
    if (enemy.damage == 10){
        if (enemy.hitcd > 0){
            if (enemy.direction == 0)
                Context.context.drawImage(imgOrc, 10 +(Math.floor(enemy.hitcd%60/10))*192, 24.6*65, 150, 100, enemy.x-270, 253, enemy.width+480, enemy.height+250);
            else
                Context.context.drawImage(imgOrc, 60 +(Math.floor(enemy.hitcd%60/10))*192, 30.8*65, 150, 100, enemy.x-90, 333, enemy.width+480, enemy.height+250);
        } else {
            if (enemy.direction == 0)
                Context.context.drawImage(imgOrc, 10+Math.floor(enemy.walk%45/5)*64, 9*65, 50, 65, enemy.x-50, 290, enemy.width+130, enemy.height+100);
            else
                Context.context.drawImage(imgOrc, 10+Math.floor(enemy.walk%45/5)*64, 11*65, 50, 65, enemy.x-50, 300, enemy.width+130, enemy.height+100);
        }
    }
}
function createnewenemy () {
    let newenemy;
    let generic = Math.floor(Math.random()*7);
    switch (generic) {
        case 4:
           newenemy = new Troll(); 
        break;
        case 5:
           newenemy = new Troll(); 
        break;
        case 6:
            newenemy = new Orc(); 
        break;
        default:
            newenemy = new Goblin(); 
            break;
    }
    return newenemy;
}

function enemiesupdate () {
    if (angrycount < 10){
        let rand = Math.floor(Math.random()*100);
        if (rand < 1){
            angry[angrycount] = createnewenemy();
            angrycount++;
        }
    }
    for (let i = 0; i < angrycount; i++){
        if (angry[i].hp < 0){
            angrycount--;
            player.score++;
            for (j = i; j < angrycount; j++){
                angry[j] = angry[j+1];
            }
        }
        if (angry[i].x < -100){  // ?????
            angrycount--;
            for (j = i; j < angrycount; j++){
                angry[j] = angry[j+1];
            }
        }
    }
    for (let i = 0; i < angrycount; i++){
        enemyupdate(angry[i]);
    }
}
function enemiesrender () {
    for (let i = 0; i < angrycount; i++){
        enemyrender(angry[i]);
    }
}

function getclosestenemyright (arrow) {
    let closestenemy;
    if (angrycount == 0)
        closestenemy = null;
    else {
        let minx = 1281;
        let mini = -1;
        for (let i = 0 ; i < angrycount; i++){
            if ((minx >= angry[i].x) && (angry[i].x >= arrow.x)){
                minx =angry[i].x;
                mini = i;
            }
        }
        closestenemy = angry[mini];
        if (mini == -1) return null;
    }
    return closestenemy;
}
function getclosestenemyleft (arrow) {
    let closestenemy;
    if (angrycount == 0)
        closestenemy = null;
    else {
        let maxx = -101;
        let maxi = -1;
        for (let i = 0 ; i < angrycount; i++){
            if ((maxx <= angry[i].x) && (angry[i].x <= arrow.x)){
                maxx =angry[i].x;
                maxi = i;
            }
        }
        closestenemy = angry[maxi];
        if (maxi == -1) return null;
    }
    return closestenemy;
}