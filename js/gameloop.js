let last = performance.now(),
    fps = 60,
    slomo = 1, // slow motion multiplier
    step = 1 / fps,
    slowStep = slomo * step,
    dt = 0,
    now;

let frame = () => {
  now = performance.now();
  dt = dt + Math.min(1, (now - last) / 1000);
  while(dt > slowStep) {
    dt = dt - slowStep;
    update(step);
  }
  last = now;

  render(dt / slomo * fps);
  requestAnimationFrame(frame);
}
function render (time){
  if (gamestate == 1){
    startmenurender();
  }
  if (gamestate == 2){
      backgroundrender();
      player.render();
      enemiesrender();
      // grass
      Context.context.drawImage(bg4, 0, 0, 1920, 1080, -(METER*200 - path)%1280, 0 , 1280, 550);
      Context.context.drawImage(bg4, 0, 0, 1920, 1080, 1280-(METER*200 - path)%1280, 0 , 1280, 550);
      //
      timer.render();
      narrowrender();
      sarrowrender();
      panelrender();
  }
  if (gamestate > 2){
    gameoverrender();
  }
  if (gamestate == 0){
    pauserender();
  }
  if (gamestate == -1){
    Context.context.fillStyle = "#4444aa";
    Context.context.fillRect(0,0,1280,720);
    Context.context.fillStyle = "#000000";
    Context.context.fillRect(640-202,360-7,404,14);
    Context.context.fillStyle = "#ffffff";
    Context.context.fillRect(640-200,360-5,400,10);
    Context.context.fillStyle = "#00aa55";
    Context.context.fillRect(640-200,360-5,gameready/11*400,10);
  }
};

function update(step) {
  if (gamestate == 0)
    gamestateupdate();
  if (gamestate == 1){
  }
  if (gamestate == 2){
    gamestateupdate();
    enemiesupdate();
    player.update();
    timer.update();
    narrowupdate();
    sarrowupdate();
  }
  if (gamestate > 2){

  }
  if (gamestate == -1){
    if (gameready > 10)
      gamestate = 1;
  }
};
requestAnimationFrame(frame);