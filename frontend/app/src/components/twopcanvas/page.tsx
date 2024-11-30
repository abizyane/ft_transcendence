"use client"
import { useEffect, useState,useRef } from "react"
import Game_Front from "./gameFront"

class ScoreBoard{
    constructor(game){
        this.game = game;
        this.ball = game.ball;
        this.first_score = 0;
        this.second_score = 0;
    }
    update(){
        if (this.ball.collisionX - this.ball.rad < this.game.player.posX )
        {
            this.first_score++;
            this.ball.init(-1)
        }
        else if (this.ball.collisionX > this.game.enemy.posX + this.game.enemy.width/2)
        {
            this.second_score++;
            this.ball.init(1)
        }
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = 'black'
        ctx.fillText(this.first_score +"-" + this.second_score, this.game.canvas.width / 2 - 50/2, 50)
        ctx.closePath();
    }
}

class Ball {
    constructor(game){
      this.game = game;
      this.fontFile = this.fontFile;
      this.canvas = game.canvas;
      this.col = 0;
      this.rad = 15;
      this.init(-1);
    }
    draw(ctx){
      ctx.beginPath();
      ctx.arc(this.collisionX, this.collisionY, this.rad , 0,  Math.PI * 2, 1);
      ctx.fillStyle = `rgb(255,255,255,0.5)`;
      ctx.strokeStyle = "white";
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    iscollide(){
      if (this.collisionX - this.rad >= this.game.player.posX && this.collisionX - this.rad - this.speed <= this.game.player.posX + this.game.player.width &&
          this.collisionY >= this.game.player.posY && this.collisionY <= this.game.player.posY + this.game.player.height){
            this.angle = ((this.collisionY - this.game.player.posY - this.game.player.height/2) * 45) / (this.game.player.height / 2);
            this.angle = this.angle * Math.PI/180;
            this.dirX = this.speed * Math.cos(this.angle);
            this.dirY = this.speed * Math.sin(this.angle);
            this.speed = 10
      }

      if (this.collisionX + this.rad >= this.game.enemy.posX && this.collisionX + this.rad + this.speed <= this.game.enemy.posX + this.game.enemy.width &&
        this.collisionY >= this.game.enemy.posY && this.collisionY <= this.game.enemy.posY + this.game.enemy.height){
          this.angle = ((this.collisionY - this.game.enemy.posY - this.game.enemy.height/2) * 45) / (this.game.enemy.height / 2);
          this.speed = 10
          this.angle = this.angle * Math.PI/180;
          this.dirX = -this.speed * Math.cos(this.angle);
          this.dirY = -this.speed * Math.sin(this.angle);
      }

      // if (this.collisionX - this.rad <= this.game.enemy.posX && this.collisionX - this.rad - this.speed >= this.game.enemy.posX + this.game.enemy.width &&
      //   this.collisionY <= this.game.enemy.posY && this.collisionY >= this.game.enemy.posY + this.game.enemy.height){
      //     this.angle = ((this.collisionY - this.game.enemy.posY - this.game.enemy.height/2) * 45) / (this.game.enemy.height / 2);
      //     this.angle = this.angle * Math.PI/180;
      //     this.dirX = this.speed * Math.cos(this.angle);
      //     this.dirY = this.speed * Math.sin(this.angle);
      // }
    }
    update(){
      if ((this.collisionY + this.rad >= this.canvas.height || this.collisionY - this.rad <= 0)){
          this.dirY *= -1;
        }
      else if ((this.collisionX + this.rad >= this.canvas.width || this.collisionX - this.rad <= 0)){
        this.dirX *= -1;
      }
      this.collisionX += this.dirX;
      this.collisionY += this.dirY;
    }
    init(yes){
      this.collisionY = this.canvas.height / 2;
      this.collisionX = this.canvas.width/2;
      this.angle = Math.random() % 2;
      this.speed = 5;
      this.dirX = yes * this.speed * Math.cos(this.angle);
      this.dirY = yes * this.speed * Math.sin(this.angle);
    }
}
    

class Enemy
{
  constructor(game)
  {
    this.game = game;
    this.canvas = game.canvas;
    this.width =  12; 
    this.height = 50;
    this.rad = 10;
    this.posX= this.canvas.width - 20 - this.width;
    this.posY = this.canvas.height/2 - this.height / 2;
    this.speed = 5;
    this.color = "red"
  }
  drawRect(ctx){
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
    ctx.strokeRect(this.posX, this.posY, this.width, this.height );
  }
  draw(ctx){
      ctx.fillStyle = this.color;
      ctx.save()
      const rgb = [255,0,0]
      ctx.shadowColor = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
      ctx.shadowBlur = 10;
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=7.5;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=6;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=4.5;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=3;
      this.drawRect(ctx);
      ctx.strokeStyle= '#fff';
      ctx.lineWidth=1;
      this.drawRect(ctx);
      ctx.restore()
  }

  update(ball)
  {
  
    // if (this.posY - ball.collisionY + this.height/2 < 0 && this.posY + this.height <= this.canvas.height)
    // {
    //   this.posY += this.speed;
    // }
    // if (this.posY - ball.collisionY + this.height/2 > 0 && this.posY >= 0){
    //   this.posY -= this.speed;
    // }
    if (this.posY > 0 && this.game.wUp)
      {
        this.posY -= this.speed;
      }
      if (this.posY < this.game.height - this.height && this.game.sUp){
        this.posY += this.speed;
      }
  }
}

class Player
{
  constructor(game)
  {
    this.game = game;
    this.canvas = game.canvas
    this.width = 12; 
    this.height = 50;
    this.rad = 10;
    this.posX=20;
    this.posY = this.canvas.height/2 - this.height / 2;
    this.speed = 5;
    this.color = "blue"
  }
  drawRect(ctx){
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
    ctx.strokeRect(this.posX, this.posY, this.width, this.height );
  }
  draw(ctx){
      ctx.fillStyle = this.color;
      ctx.save()
      const rgb = [0,0,255]
      ctx.shadowColor = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
      ctx.shadowBlur = 10;
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=7.5;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=6;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=4.5;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
      ctx.lineWidth=3;
      this.drawRect(ctx);
      ctx.strokeStyle= '#fff';
      ctx.lineWidth=1;
      this.drawRect(ctx);
      ctx.restore()
  }
  
  update()
  {
    if (this.posY > 0 && this.game.keyUp)
    {
      this.posY -= this.speed;
    }
    if (this.posY < this.game.height - this.height && this.game.keyDown){
      this.posY += this.speed;
    }
  }

}

class Game{
    constructor(canvas){
      this.width = canvas.width;
      this.height = canvas.height;
      this.canvas= canvas;
      this.player = new Player(this);
      this.enemy = new Enemy(this);
      this.ball = new Ball(this);
      this.scoreBoard = new ScoreBoard(this);
      this.keyUp = 0;
      this.keyDown = 0;
      this.speed = 5;
      this.wUp = 0
      this.sUp = 0
    //   loadFonts();

      window.addEventListener('keydown', (e) => {
        if (e.key === "ArrowUp")
        {
          this.keyDown = 0;
          this.keyUp = 1;
        }
        else if (e.key === 'ArrowDown'){
          this.keyDown = 1;
          this.keyUp = 0;
        }
        else if (e.key === "w"){
          this.wUp = 1
          this.sUp = 0
        }else if (e.key == "s"){
          this.sUp = 1
          this.wUp = 0
        }

      });
      window.addEventListener('keyup', (e) => {
         if (e.key === "ArrowUp")
        {
          this.keyDown = 0;
          this.keyUp = 0;
        }
        else if (e.key === 'ArrowDown'){
          this.keyDown = 0;
          this.keyUp = 0;
        }
        else if (e.key === "w"){
          this.wUp = 0
          this.sUp = 0
        }else if (e.key == "s"){
          this.sUp = 0
          this.wUp = 0
        }
      });
    }
    update(){
      this.player.update();
      this.ball.iscollide();
      this.ball.update();
      this.enemy.update(this.ball);
      this.scoreBoard.update();
    }

    render(ctx){
      this.player.draw(ctx);
      this.ball.draw(ctx);
      this.enemy.draw(ctx);
      this.scoreBoard.draw(ctx);
    }
    
  }
  
  export default function Twopcanvas (){
    const CanvasRef = useRef(null)
    const Context = useRef(null)
    useEffect(()=>{
        Context.current = CanvasRef.current.getContext("2d")
        CanvasRef.current.width = 560;
        CanvasRef.current.height = 400;
    }, [])
    
    useEffect(()=>{
        let game = new Game(CanvasRef.current);
        game.render(Context.current)
        function animate(){
            if (CanvasRef.current){
                Context.current.clearRect(0,0, CanvasRef.current.width, CanvasRef.current.height)
                game.update()
                game.render(Context.current)
                requestAnimationFrame(animate)
            }
        }
            requestAnimationFrame(animate)
    }, [])
    
    return (
        <canvas tabIndex={1} ref={CanvasRef} className="w-fit h-fit "></canvas>
    );
}