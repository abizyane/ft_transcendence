function neonEffect(ctx, rgb , callback){
    ctx.shadowColor = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
    ctx.shadowBlur = 20;
    ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
    ctx.lineWidth=7.5;
    callback;
    ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
    ctx.lineWidth=6;
    callback;
    ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
    ctx.lineWidth=4.5;
    callback;
    ctx.strokeStyle= "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",0.2)";
    ctx.lineWidth=3;
    callback;
    ctx.strokeStyle= '#fff';
    ctx.lineWidth=1.5;
    callback;
}

class Ball{
    constructor(game, init){
        this.game = game
        this.rad = 5
        this.posX = init.x
        this.posY = init.y
        this.color = init.color
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.rad,0, 2* Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.stroke()
    }
    update(x,y){
        this.posX = x
        this.posY = y
    }
}

class Player
{
    constructor(game, init){
        this.game = game
        this.width = init.width
        this.height = init.height
        this.posX = init.posX
        this.posY = init.posY
        this.color = init.color
    }
    drawRect(ctx){
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
        ctx.strokeRect(this.posX, this.posY, this.width, this.height );
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.save()
        const rgb = [0,0,255]
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
    update(cordinate){
        this.posY = cordinate.y
        this.posX = cordinate.x
    }
}

export default class Game_Front{
    constructor(canvas, init){
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.player_1 = new Player(this, init.player_one)
        this.player_2 = new Player(this, init.player_two)
        this.ball = new Ball(this, init.ball)
    }

    render(ctx){
        this.player_1.draw(ctx)
        this.player_2.draw(ctx)
        this.ball.draw(ctx)
    }

    update(msg){
        this.player_1.update(msg.player_1)
        this.player_2.update(msg.player_2)
        this.ball.update(msg.ball.x, msg.ball.y)
    }
}