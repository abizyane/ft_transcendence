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
        if (this.ball.posX - this.ball.rad < this.game.player.posX )
        {
            this.first_score++;
        }
        else if (this.ball.posX > this.game.enemy.posX + this.game.enemy.width/2)
        {
            this.second_score++;
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
        this.game = game
        this.rad = 5
        this.posX = game.width / 2
        this.posY = game.height / 2
        this.speed = 10
        this.angle = 45
        this.dirX = Math.cos(this.angle)
        this.dirY = Math.sin(this.angle)
    }
    draw(ctx){
      ctx.beginPath();
      ctx.arc(this.posX, this.posY, this.rad , 0,  Math.PI * 2, 1);
      ctx.fillStyle = `rgb(255,255,255,0.5)`;
      ctx.strokeStyle = "white";
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    iscollide(){
      if (this.posY + this.rad >= this.game.height || this.posY - this.rad <= 0 )
            this.dirY *= -1
      if (this.posX < this.game.width * 1/4){
          if (this.posX - this.rad <= 0){
              this.game.enemy.score += 1
              this.reset_ball()
          }
          if (this.posX - this.rad <= this.game.player.posX + this.game.player.width && (this.posY >= this.game.player.posY && this.posY <= this.game.player.posY + this.game.player.height) && ! this.game.player.isHiting)
          {
            this.dirX *= -1
            this.posX = this.game.player.posX + this.game.player.width
            this.game.player.isHiting = true
          }
      }
      else if (this.posX > this.game.width * 3/4){
          if (this.posX + this.rad >= this.game.width){
              this.game.player.score += 1
              this.reset_ball()
          }
          if (this.posX + this.rad >= this.game.enemy.posX && (this.posY >= this.game.enemy.posY && this.posY <= this.game.enemy.posY + this.game.enemy.height) && ! this.game.enemy.isHiting)
            {
              this.dirX *= -1
              this.posX = this.game.enemy.posX - this.game.enemy.width
              this.game.enemy.isHiting = true
            }
      }
      else{
        this.game.enemy.isHiting = false
        this.game.player.isHiting = false
      }
    }

    reset_ball(){
      this.posX = this.game.width / 2
      this.posY = this.game.height / 2
    }

    update(){
      this.iscollide()
      this.posX += (this.dirX * this.speed)
      this.posY += (this.dirY * this.speed)
    }
}

class Paddle{
  constructor(game){
      this.game = game;
      this.canvas = game.canvas;
      this.width =  2; 
      this.height = 60;
      this.rad = 10;
      this.posX= this.canvas.width - 20 - this.width;
      this.posY = this.canvas.height/2 - this.height / 2;
      this.speed = 10;
      this.isHitting = false
      this.color = "red"
      this.rgb = [0,0,0]
      this.offsetX = 10
  }
  drawRect(ctx){
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
    ctx.strokeRect(this.posX, this.posY, this.width, this.height );
  }
  draw(ctx){
      ctx.fillStyle = this.color;
      ctx.save()
      ctx.shadowColor = "rgb("+this.rgb[0]+","+this.rgb[1]+","+this.rgb[2]+")";
      ctx.shadowBlur = 10;
      ctx.strokeStyle= "rgba("+this.rgb[0]+","+this.rgb[1]+","+this.rgb[2]+",0.2)";
      ctx.lineWidth=7.5;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+this.rgb[0]+","+this.rgb[1]+","+this.rgb[2]+",0.2)";
      ctx.lineWidth=6;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+this.rgb[0]+","+this.rgb[1]+","+this.rgb[2]+",0.2)";
      ctx.lineWidth=4.5;
      this.drawRect(ctx);
      ctx.strokeStyle= "rgba("+this.rgb[0]+","+this.rgb[1]+","+this.rgb[2]+",0.2)";
      ctx.lineWidth=3;
      this.drawRect(ctx);
      ctx.strokeStyle= '#fff';
      ctx.lineWidth=1;
      this.drawRect(ctx);
      ctx.restore()
  }
}

class Enemy extends Paddle
{
    constructor(game)
    {
      super(game)
      this.posX= this.canvas.width - this.offsetX - this.width;
      this.posY = this.canvas.height/2 - this.height / 2;
      this.color = "red"
      this.rgb = [255,0,0]
    }
    update(ball)
    {
    
      if (this.posY - ball.posY + this.height/2 < 0 && this.posY + this.height <= this.canvas.height)
      {
        this.posY += this.speed;
      }
      if (this.posY - ball.posY + this.height/2 > 0 && this.posY >= 0){
        this.posY -= this.speed;
      }
    }
}

class Player extends Paddle
{
    constructor(game)
    {
      super(game)
      this.posX=this.offsetX;
      this.posY = this.canvas.height/2 - this.height / 2;
      this.speed = 10;
      this.color = "blue"
      this.rgb = [0,0,255]
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
      this.mouseX = 0;
      this.mouseY = 0;
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
      });
      
      canvas.addEventListener('mousemove', (e) => {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      });
    }
    update(){
      this.player.update();
      this.enemy.update(this.ball);
      this.ball.update();
      this.scoreBoard.update();
    }

    render(ctx){
      this.player.draw(ctx);
      this.ball.draw(ctx);
      this.enemy.draw(ctx);
      this.scoreBoard.draw(ctx);
    }
    
  }
  
  export default function Localcanva (){
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
      <canvas 
      tabIndex={1} 
      ref={CanvasRef} 
      className="w-full h-full " 
    ></canvas>
    
    );
}