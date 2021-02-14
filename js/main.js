const METER = 100;
let Context = {
    canvas : null,
    context : null,
    create: function (canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = this.canvas.getContext("2d");
        return this.context;
    }
};

Context.create("gameframe");


// let's ////////////////////////////////////////////

let angry = [];
let angrycount = 0;

let path = METER*200;

let gamestate = -1; // 0 pause // 1 startmenu // 2 game // 3 gameover (basic == 1) // -1 loading
let pausestate = 0;
let gameready = 0; // 5 == ready;

let playerItself = new Image();
let imgGoblin = new Image();
let imgTroll = new Image();
let imgOrc = new Image();
let imgTips = new Image();
let imgIcons = new Image();
// background //
let bg0 = new Image();
let bg1 = new Image();
let bg2 = new Image();
let bg3 = new Image();
let bg4 = new Image();
bg0.src = "img/Layers/bg0.png";
bg1.src = "img/Layers/bg1.png";
bg2.src = "img/Layers/bg2.png";
bg3.src = "img/Layers/bg3.png";
bg4.src = "img/Layers/bg4.png";
bg0.onload = () => {
    gameready++;
}
bg1.onload = () => {
    gameready++;
}
bg2.onload = () => {
    gameready++;
}
bg3.onload = () => {
    gameready++;
}
bg4.onload = () => {
    gameready++;
}
//
imgIcons.src = "img/icons.png";
imgGoblin.src = "img/goblin.png";
imgTroll.src = "img/troll.png";
imgOrc.src = "img/orc.png";
imgTips.src = "img/Tips.png";
playerItself.src = "img/PlayerSpriteSheetJackal.png";
playerItself.onload = () => {
    gameready++;
}
imgIcons.onload = () => {
    gameready++;
}
imgTips.onload = () => {
    gameready++;
}
imgOrc.onload = () => {
    gameready++;
}
imgTroll.onload = () => {
    gameready++;
}
imgGoblin.onload = () => {
    gameready++;
}
// gamestates //
function gamestateupdate(){
    if (inputState.ESC){
        if (pausestate == 0){
            pausestate = 1;
            gamestate = 0;
            Context.context.fillStyle = "rgba(100,100,100,0.4)"
            Context.context.fillRect(0,0,1280,720);
        }
        if (pausestate == 2){
            pausestate = 3;
            gamestate = 2;
        }
    } else {
        if (pausestate == 1)
            pausestate = 2;
        if (pausestate == 3)
            pausestate = 0; 
    }
}

function pauserender () {
    
    Context.context.textAlign = "center";
    Context.context.textBaseline = "bottom";
    Context.context.font = "136px bold";
    Context.context.fillStyle = "#ffffff"
    Context.context.fillText("Pause", 640 , 360); 
    Context.context.fillStyle = "#000000"
}
// timer
let timer = {
    starttime : 0,
    remaintime : 0,
    state : 1,  // 0 normal, 1 pause
    update : function () {
        this.remaintime--;
        if (this.remaintime <= 0){
            gamestate = 3;
            player.render();
            updatestorage();
        }
    },
    render : function () {
        let time = "Remain time : ";
        let mins = Math.floor(Math.floor(this.remaintime/60)/60);
        let secs = Math.floor(this.remaintime/60)%60;
        if (mins < 10)
            time += "0";
        time += mins;
        time += ":";
        if (secs < 10)
            time += "0";
        time += secs;
        Context.context.textAlign = "end";
        Context.context.textBaseline = "top";
        Context.context.font = "24px";
        Context.context.fillStyle = "white";
        Context.context.fillText(time, 1275 , 5);
    },
    resetnew : function (newtime) {
        this.starttime = newtime;
        this.remaintime = newtime;
    },
    start : function () {
        this.state = 0;
    },
    pause : function () {
        this.state = 1;
    },
    reset : function () {
        this.remaintime = this.starttime;
    }
}

timer.resetnew(60*60*3);
timer.start();

// projectiles ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// for s1 /////////////////////////////////
let Narrow = function () {
    this.direction = 0; // 0 le, 1 ri
    this.speed = METER*0.2;
    this.x = -200;
    this.height = METER * 0.1;
    this.width = METER*0.4;
    this.state = 0; // 0 no active 1 active
    this.inenemy = function (enemy) {
        if (((this.x > enemy.x) && (this.x < enemy.x + enemy.width)) && (this.direction == 0)){
            return true;
        } 
        if (((this.x+this.width > enemy.x) && (this.x+this.width < enemy.x + enemy.width)) && (this.direction == 1)) {
            return true;
        }
        return false;
    };
    this.update = function () {
        if (this.state == 1){

            // movement //
            if (this.direction == 0){
                this.x -= this.speed;
            }
            if (this.direction == 1){
                this.x += this.speed;
            }
            if ((this.x > 1380)||(this.x < -100)){
                this.state = 0;
                this.x = -200;
            }


            // collision //
            let closest;
            if (this.direction == 0)
                closest = getclosestenemyleft(this);
            else
                closest = getclosestenemyright(this);
            if (closest != null){
                if(this.inenemy(closest)){
                    closest.hp -= 15;
                    this.state = 0;
                    this.x = -200;
                }
            }    
        }
    };
    this.render = function () {
        if (this.state == 1){
            // hitbox
            //Context.context.fillStyle = "#999999";
            //Context.context.fillRect(this.x, 350, this.width, this.height);
            if (this.direction == 0)
                Context.context.drawImage(imgIcons, 0, 140+35, 450, 35, this.x-30, 348, this.width+60, this.height+20);
            else
                Context.context.drawImage(imgIcons, 0, 140, 450, 35, this.x-30, 348, this.width+60, this.height+20);
        }
    };
};

let narrow = [];
let narrowcount = 4;
narrow[0] = new Narrow();
narrow[1] = new Narrow();
narrow[2] = new Narrow();
narrow[3] = new Narrow();
function findnotactivenarrow () {
    for (let i = 0; i < narrowcount; i++){
        if (narrow[i].state == 0) {
            return i;
        }
    }
    return -1;
}
function narrowupdate () {
    for ( let i=0; i < narrowcount; i++){
        narrow[i].update();
        if (narrow[i] == undefined) console.log(i);
    }
}
function narrowrender(){
    for (let i=0; i < narrowcount; i++){
        narrow[i].render();
    }
}
//// for s3////////////////////////////////////////////////////////////
let Sarrow = function () {
    this.direction = 0; // 0 le, 1 ri
    this.speed = METER*0.15;
    this.x = -200;
    this.height = METER * 0.1;
    this.width = METER*0.4;
    this.state = 0; // 0 no active 1 active
    this.inenemy = function (enemy) {
        if (((this.x > enemy.x) && (this.x < enemy.x + enemy.width)) && (this.direction == 0)){
            return true;
        } 
        if (((this.x+this.width > enemy.x) && (this.x+this.width < enemy.x + enemy.width)) && (this.direction == 1)) {
            return true;
        }
        return false;
    };
    this.update = function (j) {
        if (this.state == 1){

            // movement //
            if (this.direction == 0){
                this.x -= this.speed;
            }
            if (this.direction == 1){
                this.x += this.speed;
            }
            if ((this.x > 1380)||(this.x < -100)){
                this.state = 0;
                this.x = -200;
                for (let i = 0; i < 10; i++){
                    this.hittedenemies[i] = 0;
                }
            }


            // collision //
            for (let i = 0 ; i  < angrycount; i++){
                if(this.inenemy(angry[i]) && this.hittedenemies[i] < j){
                    angry[i].hp -= 40/3;
                    if (angry[i].hp > 0){
                        this.hittedenemies[i] = j;
                    }
                }
            }
        }
    };
    this.render = function () {
        if (this.state == 1){
            //hitbox
            //Context.context.fillStyle = "#43b1dd";
            //Context.context.fillRect(this.x, 350, this.width, this.height);
            if (this.direction == 0)
                Context.context.drawImage(imgIcons, 0, 140+35, 450, 35, this.x-30, 348, this.width+60, this.height+20);
            else
                Context.context.drawImage(imgIcons, 0, 140, 450, 35, this.x-30, 348, this.width+60, this.height+20);
        }
    };
    this.hittedenemies = [];
};

let sarrow = [];
sarrow[0] = new Sarrow();
sarrow[1] = new Sarrow();
sarrow[2] = new Sarrow();

function sarrowupdate () {
    for (let i = 0 ; i < 3; i++){
        sarrow[i].update(i);
    }
}
function sarrowrender () {
    for (let i = 0 ; i < 3; i++){
        sarrow[i].render();
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function backgroundrender() {
    /*
    Context.context.fillStyle = "#000000";      // trans to background render
    Context.context.fillRect(0,0,1280,720); //  and this
    Context.context.fillStyle = "#ffffff";   
    Context.context.fillRect((path + 400)%1680 - 200,200,200,80);
    Context.context.fillRect((path + 1100)%1680 - 200,200,200,80);
    Context.context.fillRect((path + 800)%1680 - 200,150,200,80);
    Context.context.fillRect((path + 1305)%1680 - 200,150,200,80);
    */
    Context.context.drawImage(bg0, 0, 0, 1920, 1080, 0, 0 , 1280, 720);
    Context.context.drawImage(bg1, 0, 0, 1920, 1080, -(METER*200 - path)%(1280*6)/6, 0 , 1280, 550);
    Context.context.drawImage(bg1, 0, 0, 1920, 1080, 1280-(METER*200 - path)%(1280*6)/6, 0 , 1280, 550);
    Context.context.drawImage(bg2, 0, 0, 1920, 1080, -(METER*200 - path)%(1280*4)/4, 0 , 1280, 550);
    Context.context.drawImage(bg2, 0, 0, 1920, 1080, 1280-(METER*200 - path)%(1280*4)/4, 0 , 1280, 550);
    Context.context.drawImage(bg3, 0, 0, 1920, 1080, -(METER*200 - path)%(1280*2)/2, 0 , 1280, 550);
    Context.context.drawImage(bg3, 0, 0, 1920, 1080, 1280-(METER*200 - path)%(1280*2)/2, 0 , 1280, 550);
    
}
//////////////////////////////////////////////////////////////////////////////////////////////
// skill panel
function panelrender () {

    Context.context.fillStyle = "#aaaaaa";
    Context.context.fillRect(340, 550, 600, 150);
    Context.context.fillStyle = "#888888";
    Context.context.fillRect(345, 555, 140, 140);
    Context.context.drawImage(imgIcons, 0, 0, 140, 140, 345, 555, 140, 140);
    Context.context.fillRect(495, 555, 140, 140);
    Context.context.drawImage(imgIcons, 140, 0, 140, 140, 495, 555, 140, 140);
    Context.context.fillRect(645, 555, 140, 140);
    Context.context.drawImage(imgIcons, 280, 0, 140, 140, 645, 555, 140, 140);
    Context.context.fillRect(795, 555, 140, 140);
    Context.context.drawImage(imgIcons, 420, 0, 140, 140, 795, 555, 140, 140);
    // skill active
    Context.context.strokeStyle = "#ffffff";
    Context.context.lineWidth = 3;
    if (player.s1state > 0 && player.s1state < 30){
        Context.context.strokeRect(344, 554, 142, 142);
    }
    if (player.state == 3){
        Context.context.strokeRect(644, 554, 142, 142);
    }
    if (player.state == 2){
        Context.context.strokeRect(494, 554, 142, 142);
    }
    if (player.state == 4){
        Context.context.strokeRect(794, 554, 142, 142);
    }
    Context.context.fillStyle = "rgba(100, 100, 100, 0.5)";

    //s2
    if (player.s3state > (60) && (player.s3state < (60 + 180/8))){
        cd100(645, 555, 140, 140);
    } 
    if (player.s3state > (60 +  180/8) && (player.s3state < (60 +2*180/8))){
        cd87(645, 555, 140, 140);
    }
    if (player.s3state > (60 +  2*180/8) && (player.s3state < (60 +3*180/8))){
        cd75(645, 555, 140, 140);
    }
    if (player.s3state > (60 +  3*180/8) && (player.s3state < (60 +4*180/8))){
        cd62(645, 555, 140, 140);
    }
    if (player.s3state >(60 +  4*180/8) && (player.s3state < (60 +5*180/8))){
        cd50(645, 555, 140, 140);
    }
    if (player.s3state >(60 +   5*180/8) && (player.s3state < (60 +6*180/8))){
        cd37(645, 555, 140, 140);
    }
    if ((player.s3state >(60 +   6*180/8)) && (player.s3state < (60 +7*180/8))){
        cd25(645, 555, 140, 140);
    }
    if (player.s3state > (60 +7*180/8)){
        cd12(645, 555, 140, 140);
    }  
    //s4
    if ((player.s4state > 90) && (player.s4state < 90 + 900/8)){
        cd100(795, 555, 140, 140);
    }
    if ((player.s4state > 90 + 900/8) && (player.s4state < 90 + 2*900/8)){
        cd87(795, 555, 140, 140);
    }
    if ((player.s4state > 90 + 2*900/8) && (player.s4state < 90 + 3*900/8)){
        cd75(795, 555, 140, 140);
    }
    if ((player.s4state > 90 + 3*900/8) && (player.s4state < 90 + 4*900/8)){
        cd62(795, 555, 140, 140);
    }
    if ((player.s4state > 90 + 4*900/8) && (player.s4state < 90 + 5*900/8)){
        cd50(795, 555, 140, 140);
    }
    if ((player.s4state > 90 + 5*900/8) && (player.s4state < 90 + 6*900/8)){
        cd37(795, 555, 140, 140);
    }
    if ((player.s4state > 90 +6*900/8) && (player.s4state < 90 + 7*900/8)){
        cd25(795, 555, 140, 140);
    }
    if (player.s4state > 90 + 7*900/8){
        cd12(795, 555, 140, 140);
    }
/////// progressbar /////
Context.context.fillStyle = "rgba(200,200,200,0.5)";
Context.context.fillRect(440, 30, 400, 15);
Context.context.fillStyle = "rgba(0,100,0,0.5)";
Context.context.fillRect(440, 30, (1-(path-640)/(METER*200-640))*400 , 15);

}


function cd12(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd25(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h/2);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd37(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd50(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h);
    Context.context.lineTo(x+w/2,y+h);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd62(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h);
    Context.context.lineTo(x+w,y+h);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd75(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h);
    Context.context.lineTo(x+w,y+h);
    Context.context.lineTo(x+w,y+h/2);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd87(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h);
    Context.context.lineTo(x+w,y+h);
    Context.context.lineTo(x+w,y);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}
function cd100(x,y,w,h){
    Context.context.beginPath();
    Context.context.moveTo(x+w/2,y+h/2);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x,y);
    Context.context.lineTo(x,y+h);
    Context.context.lineTo(x+w,y+h);
    Context.context.lineTo(x+w,y);
    Context.context.lineTo(x+w/2,y);
    Context.context.lineTo(x+w/2,y+h/2);
    Context.context.fill();
    Context.context.closePath();
}