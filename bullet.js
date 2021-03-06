class Bullet {

    constructor(ctx, playerPosX, playerPosY, playerHeight, playerWidth) {
        this.ctx = ctx

        this.posX = playerPosX + playerWidth
        this.posY = playerPosY + playerHeight / 2 - 12.5

        this.width = 70
        this.height = 20

        this.velX = 10


    }


    draw() {


        this.bulletImg = new Image()
        this.bulletImg.src = "./resources/bullet_CupHead.png"

        this.ctx.drawImage(this.bulletImg, this.posX, this.posY, this.width, this.height)

        this.move()



    }

    move() {

        this.posX += this.velX
    }

}