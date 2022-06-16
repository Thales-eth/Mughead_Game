const App = {

    // LICENSE
    name: 'MUGHEAD',
    author: 'Daniel/Víctor',
    version: '1.0.0',
    license: undefined,
    description: 'Best Game in Town',
    appWidth: undefined,
    appHeight: undefined,

    // Resources
    audio: new Audio("./resources/cuphead_music.mp3"),
    winImg: undefined,
    defeatImg: undefined,
    gameOverBool: false,
    winBool: false,

    // CANVAS SIZE 
    canvasSize: {

        w: undefined,
        h: undefined
    },

    ctx: undefined,

    FPS: 120,
    framesCounter: 0,

    background: undefined,
    player: undefined,
    boss: undefined,
    floor: undefined,
    boolVal: false,
    diffBool: true,


    shiftedMeatballs: [],
    shiftedBullets: [],

    // "hitCondition" specifies the boss hitbox limit
    hitCondition: 0,

    bossHits: 0,

    init() {

        this.canvas = document.querySelector('#canvas')
        this.ctx = this.canvas.getContext('2d')

        this.setDimensions()
        this.start()
        this.audio.play()
        this.boolVal = true
    },

    setDimensions() {

        this.appWidth = window.innerWidth
        this.appHeight = window.innerHeight

        this.canvasSize.w = this.appWidth
        this.canvasSize.h = this.appHeight

        this.floor = this.canvasSize.h - 150


        document.querySelector('#canvas').setAttribute('width', this.appWidth)
        document.querySelector('#canvas').setAttribute('height', this.appHeight)
    },

    menu() {

        let diffNormal = document.querySelector(".normal")
        let diffHard = document.querySelector(".hard")
        let difficulty = document.querySelector(".difficulty")
        let canvasTag = document.querySelector("#canvas")

        diffNormal.addEventListener("click", function () {

            console.log("DIFICULTAD NORMAL!")
            App.diffBool = true
            difficulty.classList.toggle("nonDisplay")
            canvasTag.classList.toggle("nonDisplay")
            App.init()
        })

        diffHard.addEventListener("click", function () {
            console.log('Hard')
            App.diffBool = false
            difficulty.classList.toggle("nonDisplay")
            canvasTag.classList.toggle("nonDisplay")

            App.init()
        })


    },

    start() {

        this.createAll()
        this.player.setEventListeners()

        this.interval = setInterval(() => {

            this.framesCounter > 5000 ? this.framesCounter = 0 : this.framesCounter++

            this.clear()

            this.background.draw()
            this.player.draw()
            this.player.shoot()

            // Boolean values linked with key events to improve movement mechanics.
            // Key events are being checked every interval this way:
            if (this.player.leftCheck) {
                this.player.moveLeft()
            }

            if (this.player.rightCheck) {
                this.player.moveRight()
            }
            if (this.player.jumpBool) {
                console.log(this.player.jumpBool)
                this.player.animate(this.framesCounter)
            }
            this.boss.draw(this.framesCounter)
            // this.meatball.animate(this.framesCounter)
            this.boss.shoot(this.framesCounter)
            this.isCollision()
            this.clearMeatballs()
            this.clearBullets()
            // ÚLTIMOS CAMBIOS!!!
            if (this.gameOverBool) {
                this.ctx.drawImage(this.defeatImg, 0, 0, this.canvasSize.w, this.canvasSize.h)
            }
            if (this.winBool) {
                this.ctx.drawImage(this.winImg, 0, 0, this.canvasSize.w, this.canvasSize.h)
            }
        }, 1000 / this.FPS)
    },

    // VUELVE AQUÍ!!!
    createAll() {

        this.defeatImg = new Image()
        this.defeatImg.src = "./resources/defeat2.jpg"

        this.winImg = new Image()
        this.winImg.src = "./resources/victory!.png"

        this.background = new Background(this.ctx, this.canvasSize.w, this.canvasSize.h)

        if (this.diffBool) {

            this.boss = new Boss(this.ctx, 450, 400, this.canvasSize.w - 450, this.floor - 300, this.framesCounter, 100, -4)
            this.player = new Player(this.ctx, 120, 150, 100, this.floor, this.boss.position.x, this.floor - 50, 0)
        }
        if (!this.diffBool) {

            this.boss = new Boss(this.ctx, 450, 400, this.canvasSize.w - 450, this.floor - 300, this.framesCounter, 300, -6)
            this.player = new Player(this.ctx, 120, 150, 100, this.floor, this.boss.position.x, this.floor - 50, 1)
        }
    },

    clear() {

        this.ctx.clearRect(0, 0, this.appWidth, this.appHeight)
    },

    isCollision() {

        this.boss.meatballs.forEach(meatball => {
            if ((this.player.pos.x + this.player.size.width >= meatball.posX + 25 //+25 to improve hitbox limits
                && this.player.pos.x < meatball.posX + meatball.width)
                && (this.player.pos.y + this.player.size.height >= meatball.posY + 20)) { //+20 to improve hitbox limits

                this.shiftedMeatballs.push(this.boss.meatballs.shift())
                console.log('golpe!')

                Meatball.

                    this.player.hits++

                console.log(this.player.hits)
            }
        })

        // Hit condition stops bullets from constantly damaging the boss
        this.player.bullets.forEach(bullet => {

            if (bullet.posX + bullet.width >= this.boss.position.x && this.hitCondition === 0) {
                this.hitCondition++
                this.bossHits++
            }
            else {
                this.hitCondition = 0
            }

        })

        if (this.bossHits >= this.boss.hits) {
            this.youWin()
        }

        if (this.player.hits === 3) {

            this.gameOver()
        }
    },

    clearMeatballs() {

        this.boss.meatballs = this.boss.meatballs.filter(meatball => meatball.posX >= 0 - meatball.width / 2)
    },

    clearBullets() {

        this.player.bullets = this.player.bullets.filter(bullet => bullet.posX < this.boss.position.x)
    },

    gameOver() {

        this.gameOverBool = true
        clearInterval(this.interval)
        this.clear()

        this.player.hits = 0
        this.bossHits = 0

        this.shiftedMeatballs = []
        this.player.bullets = []
        this.player.cdtime = 0

        this.boolVal = false
        this.audio.pause()

        alert('pare')
        // Game restarts after 3 seconds
        setTimeout(() => {

            location.reload()
        }, 3000)

    },

    youWin() {

        clearInterval(this.interval)
        this.clear()

        this.youWin = true

        this.ctx.drawImage(this.winImg, 0, 0)

        this.player.hits = 0
        this.bossHits = 0

        this.player.bullets = []
        this.player.cdtime = 0

        boolVal = false
        this.audio.pause()



        // Game restarts after 3 seconds
        setTimeout(() => {

            location.reload()
        }, 3000)
    }

}

