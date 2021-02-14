
myWidth = window.innerWidth;
myHeight = window.innerHeight;
/// нули канваса ///
canvasx = myWidth/2 - 640;
canvasy = 20;
let startmenuanim = 0;

let textinput = "";
let button = 0; // 
let text = 0;
let mouseX = 0, mouseY = 0;
let alertstate = 0; // 0 not active // 1 ;: // 2 len 0 // 
addEventListener("mousemove", mm);
function mm (event){
    mouseX = event.pageX;
    mouseY = event.pageY;
}
addEventListener("mousedown", md);
function md (event) {
    if (gamestate == 1){
        if (event.which == 1){
            if (onStartButton()){
                button = 1;
            }
            if (onTextInput() && text == 0){
                text = 1;
            }
        }
    }
    if (gamestate > 2){
        if (event.which == 1){
            if (onRestartButton()){
                restartbutton = 1;
            }
        }
    }
}
addEventListener("mouseup", mu);
function mu (event) {
    
    if (event.which == 1 && gamestate == 1){
        if (onTextInput() && text == 1){
            text = 2;
        } else {
            
            if (textinput.length > 0 && button > 0){
                removeEventListener("keypress", kp);
                removeEventListener("keydown", kd);
                gamestate = 2;
                player.name = textinput;
                player.hp = 100;
                player.mp = 100;
                timer.reset();
            } else{
                text = 0;
                if (textinput.length == 0)
                    alertstate = 2;
                else
                    if (text == 0)
                        alertstate = 0; 
                button = 0;
            }
            
        }
            
    }
    if (event.which == 1 && gamestate > 2){
        if (restartbutton > 0){
                removeEventListener("keydown", admit);
                player.hp = 100;
                player.mp = 100;
                player.score = 0;
                player.x = 0;
                player.state = 0;
                player.speed = 0.025*METER;
                player.s1state = 0;
                player.s2state = 0;
                player.s3state = 0;
                player.s4state = 0;
                path = METER*200;
                angrycount = 0;
                timer.reset();
                timer.start();
                gamestate = 2;
        }
    }
    
}

addEventListener("keypress", kp);
function kp (event){
    if (text > 1 && event.which != 13 && event.key != ":" && event.key != ";"){
        textinput += event.key;
    }
    if (event.key == ":" || event.key == ";"){
        alertstate = 1;
    }
    if (event.which == 13){
        if (textinput.length > 0){
            gamestate++;
            removeEventListener("keypress", kp);
            removeEventListener("keydown", kd);
            player.name = textinput;
            player.hp = 100;
            player.mp = 100;
            timer.reset();
        } else {
            alertstate = 2;
        }
    }
}
addEventListener("keydown", kd);
function kd (event){
    if (event.which == 8){
        textinput = textinput.substring(0, textinput.length-1);
    }
    if (event.which == 13){
        if (textinput.length > 0 && button > 0){
            gamestate++;
            removeEventListener("keypress", kp);
            removeEventListener("keydown", kd);
            player.name = textinput;
            player.hp = 100;
            player.mp = 100;
            timer.reset();
        }
    }
}
function startmenurender (){
    // background
    Context.context.fillStyle = "#4444dd";
    Context.context.fillRect(0,0,1280,720);
    Context.context.fillStyle = "rgba(100,100,100,0.5)";
    Context.context.fillRect(0,0,1280,720);
    //
    Context.context.fillStyle = "#ffffff";
    Context.context.font = "25px bold"
    Context.context.textBaseline = "bottom";
    Context.context.textAlign = "start";
    Context.context.fillText("Enter your Username:", 640 - 256, 337);
    // textinput
    if (onTextInput())
        Context.context.fillStyle = "#aaaaaa";
    else
        Context.context.fillStyle = "#eeeeee";
    Context.context.fillRect(640 - 253, 360 - 23, 506, 46);
    Context.context.fillStyle = "#ffffff";
    Context.context.fillRect(640 - 250, 360 - 20, 500, 40);
    Context.context.fillStyle = "#000000";
    Context.context.font = "38px monospace"
    Context.context.textBaseline = "top";
    Context.context.textAlign = "start";
    
    if (textinput.length < 24)
        Context.context.fillText(textinput, 640 - 250 + 2 , 360 - 19);
    else{
       let output = textinput.substring(textinput.length-23,textinput.length); 
       Context.context.fillText(output, 640 - 250 + 2 , 360 - 19);
    }
    Context.context.font = "Lato"
    if (text > 1){
        text = text%120 + 2;
        if (text < 61){
            Context.context.fillRect(640 - 250 + 4 + Math.min(23*21, 21*textinput.length) , 360 - 19, 2, 38);
        }
    }
    //  alert
    if (alertstate == 1){
        Context.context.fillStyle = "#ffff00";
        Context.context.font = "20px bold"
        Context.context.textBaseline = "middle";
        Context.context.textAlign = "center";
        Context.context.fillText("I'm afraid, you can't use ':' and ';'.", 640, 360 + 40);
    }
    if (alertstate == 2){
        Context.context.fillStyle = "#ffff00";
        Context.context.font = "20px bold"
        Context.context.textBaseline = "middle";
        Context.context.textAlign = "center";
        Context.context.fillText("Username must be longer.", 640, 360 + 40);

    }
    // button
    if (button == 1){
        Context.context.fillStyle = "#555555";
            Context.context.fillRect(640 - 150, 720 - 80 - 200, 300, 80);
            Context.context.fillStyle = "#ffffff";
            Context.context.font = "36px bold"
            Context.context.textBaseline = "middle";
            Context.context.textAlign = "center";
            Context.context.fillText("Start game", 640, 720 - 80 + 40 - 200 );
    } else {
        if (onStartButton()){
            Context.context.fillStyle = "#999999";
            Context.context.fillRect(640 - 150, 720 - 80 - 200, 300, 80);
            Context.context.fillStyle = "#000000";
            Context.context.font = "36px bold"
            Context.context.textBaseline = "middle";
            Context.context.textAlign = "center";
            Context.context.fillText("Start game", 640, 720 - 80 + 40 - 200 );
        } else {
            Context.context.fillStyle = "#aaaaaa";
            Context.context.fillRect(640 - 150, 720 - 80 - 200, 300, 80);
            Context.context.fillStyle = "#000000";
            Context.context.font = "36px bold"
            Context.context.textBaseline = "middle";
            Context.context.textAlign = "center";
            Context.context.fillText("Start game", 640, 720 - 80 + 40 - 200 );
        }
    }

    // tips anim //////////////////////
    Context.context.drawImage(imgTips, 0 + Math.floor((Math.min((startmenuanim%60)/5)))*300, Math.floor(startmenuanim/60)*218, 300, 202, 30, 30, 300, 200);
    Context.context.drawImage(imgTips, 0 + Math.floor((Math.min((startmenuanim%40)/10)))*299, 2*213, 300, 220, 30, 250, 300, 200);
    Context.context.drawImage(imgTips, 0 + Math.floor((Math.min((startmenuanim%40)/10)))*299, 5*220, 300, 270, 30, 460, 300, 250);

    Context.context.drawImage(imgTips, 0 + Math.floor((Math.min((startmenuanim%120)/24)))*299, 3*214, 300, 220, 950, 30, 300, 200);
    Context.context.drawImage(imgTips, 0 + Math.floor((Math.min((startmenuanim%120)/24)))*299, 4*216, 300, 220, 950, 260, 300, 200);

    {
        Context.context.fillStyle = "#ffffff";
        Context.context.font = "35px bold"
        Context.context.textBaseline = "middle";
        Context.context.textAlign = "center";
        if (Math.floor(startmenuanim % 60 / 30) == 0){
            Context.context.fillText("Press \"ESC\"", 1100, 575 );
            Context.context.fillText(" for pause ", 1100, 613 );
        }
    }
    startmenuanim = (startmenuanim % 119) +1 ;
}
function onStartButton(){
    let thisx = canvasx + 640 - 150;
    let thisy = canvasy + 720 - 80 - 200;
    if (mouseX >= thisx && mouseX <= thisx + 300 && mouseY >= thisy && mouseY <= thisy + 80)
        return true;
    return false;
}
function onTextInput(){
    if ((mouseX >= canvasx + 640 - 253 && mouseX <= canvasx + 640 - 253 + 506 && mouseY >= canvasy + 360 - 23 && mouseY <= canvasy + 360 - 23 + 46))
        return true;
    return false;
}