"use client"
import { useEffect, useState,useRef } from "react"
import Game_Front from "./gameFront"
import { useGame } from "@/services/context/gameContext";

class ScoreBoard{
    constructor(game, setScores){
        this.game = game;
        this.ball = game.ball;
        this.first_score = 0;
        this.second_score = 0;
        this.scoreSetter = setScores;
      }
    update(){
        if (this.game.player.score === 10 || this.game.enemy.score === 10)
        {
            this.game.status = 0;
            this.game.player.win = true
        }
        this.scoreSetter({one : this.game.player.score , two: this.game.enemy.score });
    }
}

class Ball {
    constructor(game, color){
        this.game = game
        this.rad = 15
        this.posX = game.width / 2
        this.posY = game.height / 2
        this.speed = 600
        this.angle = 40
        this.dirX = Math.cos(this.angle)
        this.dirY = Math.sin(this.angle)
        this.color = color
    }
    draw(ctx){
      ctx.beginPath();
      ctx.arc(this.posX, this.posY, this.rad , 0,  Math.PI * 2, 1);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    iscollide(){
      if (this.posY + this.rad >= this.game.height || this.posY - this.rad <= 0 )
            this.dirY *= -1
      // if (this.posX < this.game.width * 1/4){
        let left_collission = this.posX - this.rad;
          if (left_collission <= 0){
              this.game.enemy.score += 1
              this.game.scoreBoard.update()
              this.reset_ball()
          }
          if ((left_collission <= this.game.player.posX + this.game.player.width /*&& left_collission >= this.game.player.posX*/) && (this.posY >= this.game.player.posY && this.posY <= this.game.player.posY + this.game.player.height) && ! this.game.player.isHiting)
          {
            this.dirX *= -1
            this.game.player.isHiting = true
          }
      // }
      // else if (this.posX > this.game.width * 3/4){
        let right_collision = this.posX + this.rad
          if (right_collision >= this.game.width){
              this.game.player.score += 1
              this.game.scoreBoard.update()
              this.reset_ball()
          }
          if ((right_collision >= this.game.enemy.posX /*&& right_collision <= this.game.enemy.posX + this.game.enemy.height*/) && (this.posY >= this.game.enemy.posY && this.posY <= this.game.enemy.posY + this.game.enemy.height) && ! this.game.enemy.isHiting)
            {
              this.dirX *= -1
              this.game.enemy.isHiting = true
            }
      // }
      this.game.enemy.isHiting = false
      this.game.player.isHiting = false
    }

    reset_ball(){
      this.posX = this.game.width / 2
      this.posY = this.game.height / 2
    }

    update(){
      this.iscollide()
      this.posX += (this.dirX * this.speed) * 1/60
      this.posY += (this.dirY * this.speed) * 1/60
    }
}

class Paddle{
  constructor(game, color){
      this.game = game;
      this.canvas = game.canvas;
      this.width =  2;
      this.height = 100;
      this.rad = 20;
      this.posX= this.canvas.width - 20 - this.width;
      this.posY = this.canvas.height/2 - this.height / 2;
      this.speed = 8;
      this.isHitting = false
      this.color = color
      this.rgb = color
      this.offsetX = 5
      this.score = 0
  }
  drawRect(ctx){
    ctx.fillRect(this.posX, this.posY, this.width, this.height - 10);
    ctx.strokeRect(this.posX, this.posY, this.width, this.height - 10 );
  }
  draw(ctx){
      ctx.fillStyle = this.color;
      ctx.save()
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle= this.color;
      ctx.lineWidth=7.5;
      this.drawRect(ctx);
      ctx.strokeStyle= this.color;
      ctx.lineWidth=6;
      this.drawRect(ctx);
      ctx.strokeStyle= this.color;
      ctx.lineWidth=4.5;
      this.drawRect(ctx);
      ctx.strokeStyle= this.color;
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
  constructor(game, color)
  {
    super(game, color)
    this.posX= this.canvas.width - this.offsetX - this.width;
    this.posY = this.canvas.height/2 - this.height / 2;
    this.color = color
    this.rgb = color
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

class Player extends Paddle
{
  constructor(game, color)
  {
      super(game, color)
      this.posX=this.offsetX;
      this.posY = this.canvas.height/2 - this.height / 2;
      this.speed = 10;
      this.color = color
      this.rgb = color
  }
  update(ball)
  {

    if (this.posY > 0 && this.game.wUp)
      {
        this.posY -= this.speed;
      }
      if (this.posY < this.game.height - this.height && this.game.sUp){
        this.posY += this.speed;
      }
  }

}

class Game{
    constructor(canvas,setScores, gameCustomization){
      this.width = canvas.width;
      this.height = canvas.height;
      this.canvas= canvas;
      this.player = new Player(this, gameCustomization.user_paddle_color);
      this.enemy = new Enemy(this, gameCustomization.opponent_paddle_color);
      this.ball = new Ball(this, gameCustomization.ball_color);
      this.scoreBoard = new ScoreBoard(this,setScores);
      this.keyUp = 0;
      this.keyDown = 0;
      this.speed = 5;
      this.wUp = 0;
      this.sUp = 0;
      this.status = 1;
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
      this.ball.update();
      this.enemy.update(this.ball);
      this.scoreBoard.update();
    }

    render(ctx){
      this.player.draw(ctx);
      this.ball.draw(ctx);
      this.enemy.draw(ctx);
      // this.scoreBoard.draw(ctx);
    }

  }
  
  export default function Twopcanvas ({setScores, setWinner, setLooser}){
    const CanvasRef = useRef(null)
    const Context = useRef(null)
    const {gameCustomization} = useGame();
    useEffect(()=>{
        Context.current = CanvasRef.current.getContext("2d")
        CanvasRef.current.width = 1080;
        CanvasRef.current.height = 720;
    }, [])

    useEffect(()=>{
        let game = new Game(CanvasRef.current,setScores, gameCustomization);
        game.render(Context.current)
        function animate(){
            if (CanvasRef.current){
                Context.current.clearRect(0,0, CanvasRef.current.width, CanvasRef.current.height)
                game.update()
                game.render(Context.current)
                if (game.status === 0 ){
                  if (game.player.score > game.enemy.score)
                    setWinner(true)
                  else setLooser(true)
                  return;
                }
                requestAnimationFrame(animate)
            }
        }
            requestAnimationFrame(animate)
    }, [])

    return (
        <canvas tabIndex={1}  ref={CanvasRef} className="w-full h-full "></canvas>
    );
}
