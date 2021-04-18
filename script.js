const containerEl = document.querySelector('.container');
const startBtn = document.querySelector('#start-btn');
const arrowEl = document.querySelector('.arrow');
const leftBtn = document.querySelector('#left');
const rightBtn = document.querySelector('#right');
const hitBtn = document.querySelector('#hit');
const scoreEl = document.querySelector('#score');
const gameOverEl = document.querySelector('#gameOver');


let moveX = 0;
let rotate = 0;
let score = 0;
let CANVAS_WIDTH =  innerWidth;
let CANVAS_HEIGHT = innerHeight;

const canvas =document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width =  CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
window.addEventListener('resize',()=>{
    canvas.width =  CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT; 
})
   
class Rocket{
    constructor(x,y,strAngle,endAngle,color,size){
        this.x = x;
        this.y = y;
        this.roation = 0;
        this.strAngle = strAngle;
        this.endAngle = endAngle;
        this.color = color;
        this.speedX = Math.random()*2+1.5;
        this.size = size;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(this.x,this.y,9*this.size,4*this.size,0,this.strAngle,this.endAngle,true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x,this.y,3*this.size,6*this.size,this.roation,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3;
        ctx.ellipse(this.x,this.y,this.size,this.size,this.roation,0,Math.PI*2,true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.ellipse(this.x,this.y-15,this.size,this.size,this.roation,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x,this.y+15,this.size,this.size,this.roation,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
    }
    update(){
       this.x += moveX;
       moveX = 0;
       if (this.x < 45) {
           this.x = 45;
       }
       if (this.x > CANVAS_WIDTH-45) {
           this.x = CANVAS_WIDTH-45
       }
    }
    updateEnemy(){
        this.x += this.speedX;
        if (this.x < 20) {
            this.speedX *= -1;
            this.y += 50;

        }
        if (this.x > CANVAS_WIDTH-20) {
            this.speedX *= -1;
            this.y += 50;
        }
        if (this.y > CANVAS_HEIGHT/2+100) {
            gameOverEl.innerHTML = `GAME OVER`
            enemy = [];
        }
    }
}

let rocket = new Rocket(CANVAS_WIDTH/2-6,CANVAS_HEIGHT-68,0,Math.PI,'white',4);
let enemy = [];
for (let i = 0; i < 20; i++) {
    let x1 = Math.random()*(CANVAS_WIDTH-50)+20;
    let y1 = Math.random()*100+10;
    enemy.push(new Rocket(x1,y1,-Math.PI,0,'rgb(0,255,125)',2));
}
function handleEnemy() {
    for (let i = 0; i < enemy.length; i++) {
       enemy[i].draw();
       enemy[i].updateEnemy();      
    }
}

class Particle{
    constructor(x,y,size,color){
        this.x = x;
        this.y = y;
        this.speedX = Math.random()*1.3-0.5;
        this.speedY = -(Math.random()*3.5-5.5);
        this.speedBX = Math.random()*3.5-1.5;
        this.speedBY = -(Math.random()*3.5-1.5);
        this.speedStar = -(Math.random()*1+0.05);
        this.size =  Math.random()*size+0.7;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size>0.2) {
            this.size -= 0.7;
        }
    }
    updateBlast(){
        this.x += this.speedBX;
        this.y += this.speedBY;
        if (this.size>1) {
            this.size -= 0.1;
        }
    }
    updateStar(){
        this.y -= this.speedStar;
        if (this.y > CANVAS_HEIGHT) {
           this.y = -100; 
        }
    }
    draw(){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    
}
let fireParticle = [];

function clear() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
function initFire() {
    if (fireMove < 45) {
        fireMove = 45;
    }
    if (fireMove > CANVAS_WIDTH-45) {
        fireMove = CANVAS_WIDTH-45;
    }
    for (let i = 0; i < 10; i++) {
        fireParticle.push(new Particle(fireMove,CANVAS_HEIGHT-40,10,'rgb(193, 193, 24)'));  
    }
}
function handleFire() {
    for (let i = fireParticle.length-1; i >= 0; i--) {
       fireParticle[i].update();
       fireParticle[i].draw();
       if (fireParticle[i].size < 3) {
           fireParticle.splice(i,1);
       }
    }
}
let starParticle = [];
for (let i = 0; i < 25; i++) {
    let x = Math.random()*CANVAS_WIDTH;
    let y = Math.random()*CANVAS_HEIGHT;
    starParticle.push(new Particle(x,y,0.5,'rgb(205, 255, 254)'));  
}
function handleStar() {
    for (let i = starParticle.length-1; i >= 0; i--) {
        starParticle[i].draw();
        starParticle[i].updateStar();
     }
}

let fireMove = CANVAS_WIDTH/2-6;
leftBtn.addEventListener('click',()=>{
    moveX = -20;
    fireMove -= 20;
})
rightBtn.addEventListener('click',()=>{
    moveX = 20;
    fireMove += 20;
})
let bullet = [];
class Bullet{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 5;
    }
    draw(){
        ctx.fillStyle = 'gold'
        ctx.beginPath();
        ctx.ellipse(this.x,this.y-35,3,7,0,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        this.y -= this.speed;
    }
}
function handleBullet() {
    for (let i =  bullet.length-1; i >= 0; i--) {
       bullet[i].draw();
       bullet[i].update();
       if (bullet[i].y < 0) {
           bullet.splice(i,1);
       }
        
    }
}
hitBtn.addEventListener('click',()=>{
    setTimeout(()=>{
        bullet.push(new Bullet(rocket.x, rocket.y));
      },500) 
})
let blastParticle = [];
function addBlast(m,n) {
    for (let i = 0; i < 25; i++) {
        blastParticle.push(new Particle(m,n,5,'rgba(245,225,40)')); 
    }
}
function handleBlast() {
    for (let i = blastParticle.length-1; i >= 0; i--) {
        blastParticle[i].draw();
        blastParticle[i].updateBlast();
        if (blastParticle[i].size < 2) {
         blastParticle.splice(i,1);
        }          
     }
}
function collison() {
    for (let a = 0; a < bullet.length; a++) {
        for (let b = 0; b < enemy.length; b++) {
          let distx = bullet[a].x - enemy[b].x;
          let disty = bullet[a].y - enemy[b].y;
          let distance = Math.sqrt(distx*distx + disty*disty);
          if (distance < 20) {
            score++;
            scoreEl.innerHTML = `Score: ${score}`
            let m = enemy[b].x;
            let n = enemy[b].y;
            enemy[b].x = Math.random()*(CANVAS_WIDTH-50)+20;
            enemy[b].y = Math.random()*1+100;
            bullet[a].y = -10;
            addBlast(m,n);
          }
        }
        
    }
}
function main1() {
    setInterval(()=>{
        clear();
        rocket.draw(); 
        rocket.update();   
        initFire();
        handleFire();
        handleStar();
        handleBullet();
        handleEnemy();
        collison();     
        handleBlast();
    },1000/60);
}

function main() {
    rocket.draw(); 
    rocket.update();
    handleStar();
}
startBtn.addEventListener('click',(e)=>{
    containerEl.classList.add('in');
    arrowEl.classList.add('out');
    scoreEl.classList.add('scoreOut');
    main1();
})