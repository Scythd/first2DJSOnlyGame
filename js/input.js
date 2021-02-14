let inputState = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    S1: false,
    S2: false,
    S3: false,
    S4: false,
    ESC: false,
    ENT: false
};
function inputon (e) {
    switch(e.keyCode){
        case 65: // a
            inputState.LEFT = true;
        break;
        case 37: // <-
        if (event.location == 3){
            inputState.S4 = true;
        } else
            inputState.LEFT = true;
        break;
        case 68: // d
            inputState.RIGHT = true;
        break;
        case 39: // ->
            inputState.RIGHT = true;
        break;
        case 87: //w
            inputState.UP = true;
        break;
        case 38://^
            inputState.UP = true;
        break;
        case 83://s
            inputState.DOWN = true;
        break;
        case 40://\/
        if (event.location == 3){
            inputState.S2 = true;
        } else
            inputState.DOWN = true;
        break;
        case 19: //pause
            inputState.ESC = true;
        break;
        case 27://esc
            inputState.ESC = true;
        break;
        case 49://1
            inputState.S1 = true;
        break;
        case 50://2
            inputState.S2 = true;
        break;
        case 51://3
            inputState.S3 = true;
        break;
        case 52://4
            inputState.S4 = true;
        break;
        case 97: //n1
            inputState.S1 = true;
        break;
        case 98: //n2
            inputState.S2 = true;
        break;
        case 99: //n3
            inputState.S3 = true;
        break;
        case 100: //n4
            inputState.S4 = true;
        break;
        case 34: //n3
            inputState.S3 = true;
        break;
        case 35: //n4
            inputState.S1 = true;
        break;
        
    }
};
function inputoff (e)  {
    switch(e.keyCode){
        case 65: // a
            inputState.LEFT = false;
        break;
        case 37: // <-
            if (event.location == 3){
                inputState.S4 = false;
            } else
            inputState.LEFT = false;
        break;
        case 68: // d
            inputState.RIGHT = false;
        break;
        case 39: // ->
            inputState.RIGHT = false;
        break;
        case 87: //w
            inputState.UP = false;
        break;
        case 38://^
            inputState.UP = false;
        break;
        case 83://s
            inputState.DOWN = false;
        break;
        case 40://\/
        if (event.location == 3){
            inputState.S2 = false;
        } else
            inputState.DOWN = false;
        break;
        case 19: //pause
            inputState.ESC = false;
        break;
        case 27://esc
            inputState.ESC = false;
        break;
        case 49://1
            inputState.S1 = false;
        break;
        case 50://2
            inputState.S2 = false;
        break;
        case 51://3
            inputState.S3 = false;
        break;
        case 52://4
            inputState.S4 = false;
        break;
        case 97: //n1
            inputState.S1 = false;
        break;
        case 98: //n2
            inputState.S2 = false;
        break;
        case 99: //n3
            inputState.S3 = false;
        break;
        case 100: //n4
            inputState.S4 = false;
        break;
        case 34: //n3
            inputState.S3 = false;
        break;
        case 35: //n4
            inputState.S1 = false;
        break;
    }
};
addEventListener("keydown", inputon);
addEventListener("keyup", inputoff);