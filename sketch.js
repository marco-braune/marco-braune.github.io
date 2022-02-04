let song, fft, amp_bass, amp_mid, amp_treble,bg, stars, myFont, r_number; 

//load audio track
function preload(){
  song = loadSound('./assets/TBAG_DarkChaos-Track.mp3');
  myFont = loadFont('./assets/ChargerMoSp.otf');
}

//called once upon loading the site
function setup()
{   
    createCanvas(windowWidth, windowHeight);
    r_number = random(0,99);
    
    //mode setup
    angleMode(DEGREES);
    rectMode(CENTER);

    //audio setup
    song.pause(); //click to start
    fft = new p5.FFT(); 
}

//variables to change color and size over time
let colorCounter = 0;
let lowCounter = 300;
let midCounter = 37.5;
let highCounter = 37.5;
//=======
let rotator = 0;
let sizer = 0;
let sizer2 = 0;
let started = false;

let rotStart = 0;

//called by default 60 times per second
function draw()
{//once the mouse button is pressed, draw loop is executed
  if(started===false){
    start_screen();
  }
  if(started){

    background(0);

    //======Stars==========
    randomSeed(r_number);
    fill(249,255,240,colorCounter/2);
    for(let i=0; i<=width; i+=10){
          ellipse(random(width),random(height),2);
    }
    fill(0);
    ellipse(width/2,height/2,850);
    //===========================

    //enable mouse input to change rotation and size
    rotator = map(mouseX,0, width, -90, 90);
    sizer = map(mouseY,0,height,0,1.5);
    sizer2 = map(mouseY,height,0,0,4);

    //audio analysis
    let wave = fft.waveform();
    fft.analyze();
    amp_bass = fft.getEnergy(80,150);
    amp_mid = fft.getEnergy("mid");
    amp_treble = fft.getEnergy("treble");


    //shapes
    noFill();
    setColor([colorCounter/2,55+colorCounter,55+colorCounter],[colorCounter/2,55+colorCounter,55+colorCounter],10);
    draw_triangle(lowCounter+amp_bass/2, windowWidth/2, windowHeight/2,0-rotator,true);
    draw_triangle(300+amp_bass/2*sizer, windowWidth/2, windowHeight/2,0-rotator,true);
    draw_triangle(midCounter+amp_mid/4, windowWidth/2, windowHeight/2,180+rotator);
    draw_triangle(highCounter+amp_treble, windowWidth/2, windowHeight/2,180+rotator);
    draw_triangle(37.5, windowWidth/2, windowHeight/2,180+rotator);

    if(sizer2>1){
    draw_triangle(37.5*sizer2, windowWidth/2, windowHeight/2,180+rotator);
    }

    drawingContext.shadowBlur=0;

    //=========draw eclipse circle=================
    noStroke();
    fill(255,255,255,colorCounter);
    
    push();
    translate(windowWidth/2, windowHeight/2); 
    for(let i=5; i<=175; i++){
      let index = floor(map(i,0,180,0, wave.length-1));
      let r = map(wave[index],-1,1,275,375); 
      
      for(let j=0; j<=3; j++){
        let x = r*sin(i);
        let y = r*cos(i); 
        ellipse(x-(10*j),y,1);
      }
    }
    setColor(0,255,20);
    noFill();
    stroke(255,255,255,colorCounter/4);
    arc(0,0,650,650,90,270);
    pop();
    //=======================================
      
    //variable changing over time - set a limit
    if(colorCounter<200 && song.isPlaying()){
      colorCounter+=amp_bass/600;
    }

    //light scene up at high freqs
    if(amp_treble>=0.52){
      if(colorCounter<500){
        colorCounter+=20;
      }
      
    }else{
      if(colorCounter>200){
        colorCounter-=20;
      }
    }

    if(lowCounter<=320){
      lowCounter+=amp_bass/1000;
    }
    if(midCounter<=150){
      midCounter+=amp_mid/1000;
    }
    if(highCounter<=75){
      highCounter+=amp_treble/100;
    }
  }  
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  //draw an equilateral triangle around a defined middle
  function draw_triangle(sideLenght, middlePoint_X, middlePoint_Y,rotation, edges_only=undefined,){
    
    const radius = sideLenght;
    const middleX = middlePoint_X;
    const middleY = middlePoint_Y;
    const rot = rotation;
 
    push();
    translate(middleX, middleY);
    rotate(rot);

    //use polar coordinates to define points of the triangle
    //negative to turn it upside down
    const x1 = -radius*cos(30);
    const y1 = -radius*sin(30);
    const x2 = -radius*cos(150);
    const y2 = -radius*sin(150);
    const x3 = -radius*cos(270);
    const y3 = -radius*sin(270);
    triangle(x1,y1,x2,y2,x3,y3);

    if(edges_only){
      noStroke();
      fill(0);
      drawingContext.shadowBlur=0;
      rotate(180);
      triangle(x1,y1,x2,y2,x3,y3);
    }
    pop();
  }

  //all in one function to define the look
  function setColor(strokeColor, glowColor, glowRadius){
    stroke(strokeColor);
    drawingContext.shadowBlur=glowRadius;
    drawingContext.shadowColor=color(glowColor);

  }

  //control music player
  function mousePressed() {
    started = true;
    
    if (song.isPlaying()) {
      song.pause();
      cursor(ARROW);
      
    } else {
      song.play();
      noCursor();
      
    }
  }

  function start_screen(){

    background(0);
    noFill();
    setColor([100,255,255],[100,255,255],10);
    draw_triangle(37.5, windowWidth/2, windowHeight/2,-90+rotator);

    textFont(myFont);
    noFill();
    stroke(255,255,255,100);
    textSize(36);
    textAlign(CENTER);
    text("DARK CHAOS", width/2, height/2-150, 500, 50);
    textSize(24);
    drawingContext.shadowBlur=0;
    noStroke();
    fill(255,255,255,100);
    text("Music and Visuals by Marco Braune",width/2, height/2-100,500,50);
  }

