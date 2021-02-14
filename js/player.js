const level = 325;

let player = {
    hp : 100,
    maxhp : 100,
    mp : 100,
    maxmp : 100,
    name : "User",
    score: 0,
    speed : 0.04*METER,
    x : 0,
    width : 0.7*METER,
    height : 1.5*METER,
    state: 0,
    s1state : 0,
    s2state : 0,
    s2anim : 0,
    s3state : 0,
    s4state : 0,
    xfor4s : 0,
    walkstate : 0,
    direction : 1, // 0 left, 1 right
    s1 : function () {
        //this.state = 1;
        if (this.s1state == 0 && this.s2anim == 0)
            this.s1state = 1;
        
    },
    s2on : function () {
        if (this.mp >= 2 && this.state == 0){
            this.s2anim = 1;
            this.mp-=5;
            this.s1state = 0;
        }
    },
    s2off : function () {
        this.state = 0;
        this.s2anim = 150;
    },
    s3 : function () {
        if (this.s3state == 0 && this.mp > 10 && this.s2anim == 0){
            this.state = 3;
            this.s3state = 1;
            this.mp -= 10;
        }
    },
    s4 : function () {
        if ((this.mp > 30) && (this.s4state == 0) && this.s2anim == 0){
            this.mp -= 30;
            this.state = 4;
            this.s4state = 1;
        }
    },
    /*
    UU    UU  PPPPPP   DDDDDD       A      TTTTTT  EEEEEE  
    UU    UU  PP   PP  DD    DD    A A       TT    EE      
    UU    UU  PPPPPP   DD    DD   A   A      TT    EEEE    
    UU    UU  PP       DD    DD  AAAAAAA     TT    EE      
      UUUU    PP       DDDDDD   A       A    TT    EEEEEE  
    */
    update : function () {
        if (player.hp <= 0){
            gamestate = 3;
            player.hp = 0;
            player.render();
            updatestorage();
        }
        // hp mp regen ////////
        this.hp += 2/60;
        this.mp += 5/60;
        if (this.hp > this.maxhp)
            this.hp = this.maxhp;
        if (this.mp > this.maxmp){
            this.mp = this.maxmp;
        }
        //////// movement /////////
        if (inputState.LEFT){
            if (this.state == 0 && this.s2anim == 0  && this.s1state == 0 || this.state == 2 ){
                this.x-=this.speed;
                this.walkstate = this.walkstate%79 + 1;
            }
            this.direction = 0;
        } else 
        if (inputState.RIGHT){
            if (this.state == 0 && this.s2anim == 0 && this.s1state == 0 || this.state == 2 ){
                this.x+=this.speed;
                this.walkstate = this.walkstate%79 + 1;
            }
            this.direction = 1;
        } else {
            this.walkstate = 0;
        }
        ///// no skill uses ///////
        if (this.state == 0){
            if (inputState.S1){
                this.s1();
            } 
            if (inputState.S2 ){
                if (this.s2state == 0) {
                    this.s2on();
                    this.s2state = 1; // when activate and button still down
                }
            } else {
                this.s2state = 0;
            }
            if (inputState.S3){
                this.s3();
            } 
            if (inputState.S4){
                this.s4();
            } 
        }
        //// basic shot use /////
        if (this.state == 1){
            
        }
        if (this.s1state > 0){
            if (this.s1state == 35){
                let free = findnotactivenarrow();
                if (free != -1){
                    narrow[free].state = 1;
                    narrow[free].x = this.x;
                    narrow[free].direction = this.direction;
                }
                this.s1state = 0;
            } else 
                this.s1state++;
        }
        //////// shield uses ////////
        if (this.s2anim > 0){ // s2 active
            if (inputState.S2){
                if (this.s2state == 2 && this.s2anim < 150) { // deactive
                    this.s2off();
                    this.s2state = 3; // button down after deactive
                }
            } else {    // when active and after active down
                this.s2state = 2; // when after act down
            }
            this.mp-= 1 / 12;
            
        }
        if (this.s2anim > 0 && this.s2anim < 145){
            this.s2anim++;
            //this.s1state = 0;
            //this.s3state = 0;
            //this.s4state = 0;
            if (this.s2anim == 50){
                this.state = 2;
            }

        }
        if (this.s2anim > 149){
            if (this.s2anim == 200){
                this.s2anim = 0;
            } else 
                this.s2anim = this.s2anim + 1;
        }
        /////// s3 use ///////
        if (this.state == 3){
            if (this.s3state == 20){
                sarrow[0].state = 1;
                sarrow[0].x = this.x;
                sarrow[0].direction = this.direction;
            }
            if (this.s3state == 40){
                sarrow[1].state = 1;
                sarrow[1].x = this.x;
                sarrow[1].direction = this.direction;
            }
            if (this.s3state == 60){
                sarrow[2].state = 1;
                sarrow[2].x = this.x;
                sarrow[2].direction = this.direction;
                this.state = 0;
            }
        }
        if (this.s3state > 0){
            this.s3state++;
            if (this.s3state >= 240){
                this.s3state = 0;
            }
        }
        ////// for s4 /////////////
        if (this.state == 4){
            if (this.s4state == 1)
                this.xfor4s = this.x;
            if (this.s4state == 90){
                // launch animation
                this.state = 0;
                
            }
        }
        if (this.s4state > 0){
            this.s4state++;
            if (this.s4state == 990){
                this.s4state = 0;
            }
            if (this.s4state == 96){
                for (let i = 0; i < angrycount; i++){
                    if ((angry[i].x <= this.xfor4s + METER*4.8) && (angry[i].x >= this.xfor4s - METER*4.8)){
                        angry[i].hp -= 34;
                    }
                }
            }
            if (this.s4state == 108){
                for (let i = 0; i < angrycount; i++){
                    if ((angry[i].x <= this.xfor4s + METER*4.8) && (angry[i].x >= this.xfor4s - METER*4.8)){
                        angry[i].hp -= 34;
                    }
                } 
            }
            if (this.s4state == 120){
                for (let i = 0; i < angrycount; i++){
                    if ((angry[i].x <= this.xfor4s + METER*4.8) && (angry[i].x >= this.xfor4s - METER*4.8)){
                        angry[i].hp -= 34;
                    }
                }
            }
        }
        ////////// the borders and camera lock /////////////////
        if (this.x < 0){ 
        this.x = 0;
        }
        if (this.x > 1280-this.width){
            this.x = 1280-this.width;
        }
        if (this.x > 640 - this.width/2) {
            if (path > 640 - this.width/2){
                path -= this.x - (640 - this.width/2); ///////////////////////// not inlude the end of map !!!! rework!
                this.xfor4s -= this.x - (640 - this.width/2);
                this.x = 640 - this.width/2;
                
                for (let i = 0 ; i < angrycount; i++){
                    angry[i].x -= this.speed;
                }
            } else {
                if (this.x > 1280 - this.width-1){
                     gamestate = 3;
                     player.render();
                     updatestorage();
                }
            }
        }
    },

    /*
    RRRRRRR  EEEEEE  NN      NN  DDDDD    EEEEEE  RRRRRRR  
    RR   RR  EE      NNNN    NN  DD   DD  EE      RR   RR  
    RRRRR    EEEE    NN  NN  NN  DD   DD  EEEE    RRRRR    
    RR RR    EE      NN    NNNN  DD   DD  EE      RR RR    
    RR   RR  EEEEEE  NN      NN  DDDDD    EEEEEE  RR   RR  
    */
    render : function () {
        // model

        

        /*
        Context.context.fillStyle = "#00aa00";
        Context.context.fillRect(this.x, 300, this.width, this.height);
        if (this.state == 2){  // shield
            Context.context.fillStyle = "#aaaa00";
            if (this.direction == 1){
                Context.context.fillRect(this.x + METER*0.8, 300, METER*0.2, this.height);
            } else {
                Context.context.fillRect(this.x - 40   , 300, METER*0.2, this.height);
            }
        } */
        // player hitbox ///
        /////////////////////////////////
        if (this.state == 0 && this.s1state == 0 && this.s2anim == 0){
            if (this.direction == 0){
                Context.context.drawImage(playerItself, 170 + Math.floor((4+this.walkstate)/5)*372.5, 170+1*372.5, 350, 350, this.x-215, level, this.width+260, this.height+80);
            }
            else {
                Context.context.drawImage(playerItself, 210 + Math.floor((4+this.walkstate)/5)*372.5, 170+0*372.5, 350, 350, this.x-160, level, this.width+260, this.height+80);
                //Context.context.drawImage(playerItself,);
            }
        } else if (this.s2anim > 0){
            if (this.s2anim < 50){
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + Math.floor((this.s2anim)/5)*372.5, 170+5*377.5, 350, 350, this.x-160, level-1, this.width+266, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + Math.floor((this.s2anim)/5)*372.5, 170+4*379.5, 350, 350, this.x-127, level, this.width+266, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            } else if (this.s2anim > 150){
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + Math.floor((200-this.s2anim)/5)*372.5, 170+5*377.5, 350, 350, this.x-160, level-1, this.width+266, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + Math.floor((200-this.s2anim)/5)*372.5, 170+4*379.5, 350, 350, this.x-127, level, this.width+266, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            } else {
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 170 + Math.floor((4+this.walkstate)/5)*372.5, 170+3*367.5, 350, 350, this.x-215, level-1, this.width+260, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 210 + Math.floor((4+this.walkstate)/5)*372.5, 170+2*370, 350, 350, this.x-160, level, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            }
        } else if (this.s1state > 0){
            if (this.direction == 0){
                Context.context.drawImage(playerItself, 240 + Math.floor((this.s1state)/6)*372.5, 170+7*370, 350, 350, this.x-149, level-34, this.width+260, this.height+80);
            }
            else {
                Context.context.drawImage(playerItself, 240 + Math.floor((this.s1state)/6)*372.5, 170+6*370, 350, 350, this.x-132, level-32, this.width+260, this.height+80);
                //Context.context.drawImage(playerItself,);
            }
        } else if (this.s3state > 0 && this.s3state < 79 && this.s2anim == 0){

            if (this.s3state > 10){
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + (Math.floor((this.s3state-10)%19/4)+1)*372.5, 170+7*370, 350, 350, this.x-149, level-34, this.width+260, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + (Math.floor((this.s3state-10)%19/4)+1)*372.5, 170+6*370, 350, 350, this.x-132, level-32, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
                
            } else if (this.s3state < 11){
               if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + (Math.floor(Math.min((this.s3state/6),1)))*372.5, 170+7*370, 350, 350, this.x-149, level-34, this.width+260, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + (Math.floor(Math.min((this.s3state/6),1)))*372.5, 170+6*370, 350, 350, this.x-132, level-32, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            } else if (this.s3state > 70){
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + (6)*372.5, 170+10*370, 350, 350, this.x-149, level-34, this.width+260, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + (6)*372.5, 170+10*370, 350, 350, this.x-132, level-32, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            }
        } 
        if (this.s4state>0 && this.s4state < 600 && this.s2anim == 0){
            if (this.s4state < 90)
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + Math.floor((Math.abs(45 + 45*(Math.max(Math.floor(this.s4state/45)*2,0) - 1)-(this.s4state))-1)%45/9.1)*372.5, 170+9*370, 350, 350, this.x-149, level-38, this.width+260, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + Math.floor((Math.abs(45 + 45*(Math.max(Math.floor(this.s4state/45)*2,0) - 1)-(this.s4state))-1)%45/9.1)*372.5, 170+8*370, 350, 350, this.x-132, level-36, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            if (this.s4state == 90)
                if (this.direction == 0){
                    Context.context.drawImage(playerItself, 240 + 0*372.5, 170+9*370, 350, 350, this.x-149, level-38, this.width+260, this.height+80);
                }
                else {
                    Context.context.drawImage(playerItself, 240 + 0*372.5, 170+8*370, 350, 350, this.x-132, level-36, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself,);
                }
            // fist
            if (this.s4state*20-2000+400 < 310){
                    Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 150, this.s4state*20-2000+300, this.width+260, this.height+80);
                    Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s + 100, this.s4state*20-2000+300, this.width+260, this.height+80);
                    Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 400, this.s4state*20-2000+300, this.width+260, this.height+80);
                    //Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s, this.s4state*20-2000, this.width+260, this.height+80);
            } else {
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 150, 310, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 400, 310, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s + 100, 310, this.width+260, this.height+80);
            }
            // second
            if (this.s4state*20-2200+360 < 310){
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 90, this.s4state*20-2200+260, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s + 160, this.s4state*20-2200+260, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 340, this.s4state*20-2200+260, this.width+260, this.height+80);
                //Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s, this.s4state*20-2000, this.width+260, this.height+80);
            } else {
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 90, 310, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 340, 310, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s + 160, 310, this.width+260, this.height+80);
            }
            // fird
            if (this.s4state*20-2400+320 < 310){
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 210, this.s4state*20-2400+220, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s + 40, this.s4state*20-2400+220, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 460, this.s4state*20-2400+220, this.width+260, this.height+80);
                //Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s, this.s4state*20-2000, this.width+260, this.height+80);
            } else {
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 210, 310, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s - 460, 310, this.width+260, this.height+80);
                Context.context.drawImage(playerItself, 240 + 0*372.5, 170+10*370, 350, 350, this.xfor4s + 40, 310, this.width+260, this.height+80);
            }
            //Context.context.fillRect(this.xfor4s-4.8*METER, 500, 9.6*METER, 10);
        }


        // bars + username
        Context.context.textAlign = "start";
        Context.context.textBaseline = "top";
        Context.context.fillStyle = "#ffffff";
        Context.context.font = "11px bold";
        Context.context.fillText("HP", 5 , 5);
        Context.context.fillText("MP", 5 , 19);
        Context.context.font = "24px bold";
        Context.context.fillText(player.name, 5, 33);
        Context.context.fillRect(25, 5, this.maxhp*2+2, 11);
        Context.context.fillRect(25, 19, this.maxmp*2+2, 11);
        Context.context.fillStyle = "#dd0000";
        Context.context.fillRect(26, 6, this.hp*2, 9);
        Context.context.fillStyle = "#0000dd";
        Context.context.fillRect(26, 20, this.mp*2, 9);

        // score
        Context.context.textAlign = "end";
        Context.context.fillStyle = "#ffffff";
        Context.context.fillText("Score: " + this.score, 1275, 32);

    }
};





