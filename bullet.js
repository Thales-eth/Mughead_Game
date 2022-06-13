class Bullet {
    constructor(ctx, playerPosX, playerPosY, playerHeight, playerWidth) {
        this.ctx = ctx

        this.posX = playerPosX + playerWidth
        this.posY = playerPosY + playerHeight / 2 - 12.5

        this.width = 50
        this.height = 25

        this.velX = 20

    }


    draw() {
        this.ctx.fillStyle = 'red'
        this.ctx.fillRect(this.posX, this.posY, this.width, this.height)

        this.move()
    }

    move() {
        this.posX += this.velX
    }

}