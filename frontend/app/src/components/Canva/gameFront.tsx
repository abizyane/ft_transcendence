class Ball{
    constructor(game, init){
        this.game = game
        this.rad = 15
        this.posX = init.x
        this.posY = init.y
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.rad,0, 2* Math.PI)
        ctx.fillStyle = 'white'
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
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
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