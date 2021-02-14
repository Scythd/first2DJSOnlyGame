

let goTab = {
    names : new Array(),
    scores : new Array(),
    times : new Array(),
    place: -1,
    count : -1,
}

function updatestorage() {
    let count = 0;
    let ends = new Array();
    //localStorage.removeItem("results");
    let res = localStorage.getItem("results");
    let top = 0;
    let isAdded = false;
    ends[0] = -1;
    if (res != null){
        for (let i = res.indexOf('\n') ; i != -1;  i = res.indexOf('\n', i + 1)){
            count++;
            ends[count] = i;
        }
    } else {
        count = 0;
    }   

    if (res == null){
        res = "Name:" + player.name +';Score:'+ player.score + ";Time:" + timer.remaintime + ";Id:"+ (count+1) + ";\n";
    } else {
        //res += "Name:" + player.name +';Score:'+ player.score + ";Time:" + timer.remaintime + ";Id:"+ (count+1) + ";\n";
        for (let i = res.indexOf(';Score:') ; i != -1;  i = res.indexOf(';Score:', i + 1)){
            let thisScore = parseInt(res.substring(i + 7,res.indexOf(";Time:",i)));
            let thisTime = parseInt(res.substring(res.indexOf(";Time:",i)+6,res.indexOf(";Id:",i)));
            if (thisScore == player.score){
                if (thisTime <= timer.remaintime){  
                    let split = (res.substring(0,i)).lastIndexOf('\n')+1; //  ....'\n' [here new res] [the reselat that find] ...
                    res = res.slice(0, split) + "Name:" + player.name +';Score:'+ player.score + ";Time:" + timer.remaintime + ";Id:"+ (count+1) + ";\n" + res.slice(split,res.length+1);
                    count++;
                    isAdded = true;
                    break;
                }
            } else {
                if (thisScore < player.score){
                    let split = (res.substring(0,i)).lastIndexOf('\n')+1; //  ....'\n' [here new res] [the reselat that find] ...
                    res = res.slice(0, split) + "Name:" + player.name +';Score:'+ player.score + ";Time:" + timer.remaintime + ";Id:"+ (count+1) + ";\n" + res.slice(split,res.length+1);
                    count++;
                    isAdded = true;
                    break;
                } 
            }
            top++;
        }
        if (!isAdded){
            res += "Name:" + player.name +';Score:'+ player.score + ";Time:" + timer.remaintime + ";Id:"+ (count+1) + ";\n";
            count++;
        }
    }
    top++;
    goTab.place = top;
    goTab.count = count;
    // Game Over Tab Creation //
    if (top < 11){
        for (let i = 0 ;i < Math.min(count, 10);i++){
            let str = res.substring(ends[i],ends[i+1]);
            goTab.names[i] = str.substring(str.indexOf("Name:")+5,str.indexOf(";Score:"));
            goTab.scores[i] = parseInt(str.substring(str.indexOf(";Score:")+7,str.indexOf(";Time:")));
        }
    } else {
        for (let i = 0 ;i < Math.min(count, 9);i++){
            let str = res.substring(ends[i],ends[i+1]);
            goTab.names[i] = str.substring(str.indexOf("Name:")+5,str.indexOf(";Score:"));
            goTab.scores[i] = parseInt(str.substring(str.indexOf(";Score:")+7,str.indexOf(";Time:")));
        }
        goTab.names[9] = player.name ;
        goTab.scores[9] = player.score;
    }

    localStorage.setItem("results", res);
    addEventListener("keydown", admit);
}

let goanim = 0;
let restartbutton = 0;
function gameoverrender(){
    
    // background
    Context.context.fillStyle = "#444444";
    Context.context.fillRect(0,0,1280,720);
    // go text //
    if (goanim < 240){
        goanim++;
    let opacity = "" + (goanim/240 - Math.max(0,(goanim-120)/120));
    Context.context.fillStyle = "rgba(255,255,255,"+ opacity +")";
    Context.context.font = "128px bold"
    Context.context.textBaseline = "middle";
    Context.context.textAlign = "center";
    Context.context.fillText("Game Over", 640, 360);    
    } else {
    // goTab // Game Over Tab //
        Context.context.fillStyle = "#443322";
        if (goTab.place < 11)
            Context.context.fillRect(640 - 300, 360 - 300, 600, 420);
        else
            Context.context.fillRect(640 - 300, 360 - 300, 600, 430);
        Context.context.fillStyle = "#ffffff";
        Context.context.font = "36px bold"
        Context.context.textBaseline = "top";
        // text on tab
        if (goTab.place < 11){
            for (let i = 0 ; i < 10; i++){
                if (i+1 == goTab.place)
                    Context.context.fillStyle = "#ffff00";
                Context.context.textAlign = "start";
                Context.context.fillText("" + (i+1) + ". " + goTab.names[i], 640 - 290, 360 - 290 + i * 41);
                Context.context.textAlign = "end";
                Context.context.fillText(goTab.scores[i], 640 + 290, 360 - 290 + i * 41);
                if (i+1 == goTab.place)
                    Context.context.fillStyle = "#ffffff";
            }
        } else {
            for (let i = 0 ; i < 9; i++){
                Context.context.textAlign = "start";
                Context.context.fillText("" + (i+1) + ". " + goTab.names[i], 640 - 290, 360 - 290 + i * 41);
                Context.context.textAlign = "end";
                Context.context.fillText(goTab.scores[i], 640 + 290, 360 - 290 + i * 41);
            }
            Context.context.fillStyle = "#000000";
            Context.context.fillRect(640 - 290, 360 - 290 + 9 * 41, 580, 3);
            Context.context.fillStyle = "#ffff00";
            Context.context.textAlign = "start";
            
            Context.context.fillText("" + goTab.place + ". " + goTab.names[9], 640 - 290, 360 - 290 + 9 * 41 + 10);
            Context.context.textAlign = "end";
            Context.context.fillText(goTab.scores[9], 640 + 290, 360 - 290 + 9 * 41 + 10);
        }

    // restart button
    if (restartbutton == 1){
        Context.context.fillStyle = "#555555";
            Context.context.fillRect(640 - 150, 720 - 200, 300, 80);
            Context.context.fillStyle = "#ffffff";
            Context.context.font = "36px bold"
            Context.context.textBaseline = "middle";
            Context.context.textAlign = "center";
            Context.context.fillText("Restart", 640, 720 + 40 - 200 );
    } else {
        if (onStartButton()){
            Context.context.fillStyle = "#999999";
            Context.context.fillRect(640 - 150, 720 - 200, 300, 80);
            Context.context.fillStyle = "#000000";
            Context.context.font = "36px bold"
            Context.context.textBaseline = "middle";
            Context.context.textAlign = "center";
            Context.context.fillText("Restart", 640, 720 + 40 - 200 );
        } else {
            Context.context.fillStyle = "#aaaaaa";
            Context.context.fillRect(640 - 150, 720 - 200, 300, 80);
            Context.context.fillStyle = "#000000";
            Context.context.font = "36px bold"
            Context.context.textBaseline = "middle";
            Context.context.textAlign = "center";
            Context.context.fillText("Restart", 640, 720 + 40 - 200 );
        }
    }
    }
}

function onRestartButton(){
    let thisx = canvasx + 640 - 150;
    let thisy = canvasy + 720- 200;
    if (mouseX >= thisx && mouseX <= thisx + 300 && mouseY >= thisy && mouseY <= thisy + 80)
        return true;
    return false;
}

function admit (event){
    if (event != undefined){
        if (gamestate > 2 && event.which == 13){
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