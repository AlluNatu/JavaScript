let game;
let gamescore = 0;
let gametextVisibility = false;

const gameOptions = {
    dudeGravity: 800,
    dudeSpeed: 300
    
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#112211",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 1000,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: PlayGame
    }

    game = new Phaser.Game(gameConfig)
    window.focus();
}

class PlayGame extends Phaser.Scene {

    constructor(){
        super("PlayGame")
        this.jetpackActive = false
        this.jetpackDuration = 5000
        this.jetpackActivate = null
    }

    preload() {
        this.load.image("ground", "assets/platform.png")
        this.load.image("star", "assets/star.png")
        this.load.image("starRED", "assets/starRED.png")
        this.load.image("starPURPLE", "assets/starPURPLE.png")
        this.load.image("bomb", "assets/bomb.png")
        this.load.image("jetpack", "assets/jetpak.png")
        this.load.image("shark", "assets/shakro.png")
        this.load.spritesheet("dude", "assets/dude.png", {frameWidth: 32, frameHeight: 48})
    }

    create() {

        this.score = 0;

        this.groundGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        for(let i = 0; i < 20; i++) {
            this.groundGroup.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), "ground");
        }

        this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "dude")
        this.dude.body.gravity.y = gameOptions.dudeGravity
        this.physics.add.collider(this.dude, this.groundGroup)
        

        this.starsGroup = this.physics.add.group({})
        this.physics.add.collider(this.starsGroup, this.groundGroup)
        this.add.image(16, 16, "star")
        this.scoretextFullTime = this.add.text(32, 3, "0", {
            fontSize: "32px",
            fill: "#ffffff"
        })

        this.jetpackGroup = this.physics.add.group({})

        this.gameEndText = this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", {
            fontSize: "20px",
            fill: "#ffffff"
        }).setOrigin(0.5)
        this.gameEndText.setVisible(gametextVisibility);
        this.gameEndText.setDepth(10)

        this.scoreText = this.add.text(game.config.width / 2, game.config.height / 2+40, "Your score was: " + this.score.toString() , {
            fontSize: "20px",
            fill: "#ffffff"
        }).setOrigin(0.5)
        this.scoreText.setVisible(gametextVisibility);
        this.scoreText.setDepth(10)

        
        this.startText = this.add.text(game.config.width / 2, game.config.height / 2+80, "Click mouse1 to play again" , {
            fontSize: "20px",
            fill: "#ffffff"
        }).setOrigin(0.5)
        this.startText.setVisible(gametextVisibility);
        this.startText.setDepth(10)

        this.timerJetpackImage = this.add.image(30, 55, "jetpack")
        this.timerJetpackImage.setVisible(false)


        this.starsGroupRED = this.physics.add.group({})
        this.starsGroupPURPLE = this.physics.add.group({})
        this.bombGroup = this.physics.add.group({})
        this.sharksGroup = this.physics.add.group({})

        this.physics.add.collider(this.starsGroupPURPLE, this.groundGroup)
        this.physics.add.collider(this.starsGroupRED, this.groundGroup)

        this.physics.add.overlap(this.dude, this.starsGroup, this.collectStar, null, this)
        this.physics.add.overlap(this.dude, this.starsGroupRED, this.collectStarRED, null, this)
        this.physics.add.overlap(this.dude, this.starsGroupPURPLE, this.collectStarPURPLE, null, this)
        this.physics.add.overlap(this.dude, this.bombGroup, this.bombEXPLODE, null, this)
        this.physics.add.overlap(this.dude, this.jetpackGroup, this.flymodeActivate, null, this)
        this.physics.add.overlap(this.dude, this.sharksGroup, this.sharkgoKILL, null, this)

        this.jetpackActivate = this.add.image(this.dude.x, this.dude.y, "jetpack").setOrigin(0.5, 0.5)
        this.jetpackActivate.setVisible(false)
        this.jetpackActivate.setDepth(-1)


        this.cursors = this.input.keyboard.createCursorKeys()

        if (!this.anims.exists('left')) {
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('turn')) {
            this.anims.create({
                key: "turn",
                frames: [{ key: "dude", frame: 4 }],
                frameRate: 10,
                repeat: -1
            });
        }
    
        if (!this.anims.exists('right')) {
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }

        this.triggerTimer = this.time.addEvent({
            callback: this.addGround,
            callbackScope: this,
            delay: 700,
            loop: true
        })

        this.triggerTimerREDSTAR = this.time.addEvent({
            callback: this.addREDStars,
            callbackScope: this,
            delay: 1500,
            loop: true
        })

        this.triggerTimerPURPLESTAR = this.time.addEvent({
            callback: this.addPURPLEStars,
            callbackScope: this,
            delay: 3000,
            loop: true
        })

        this.triggerTimerBOMB = this.time.addEvent({
            callback: this.addBOMBS,
            callbackScope: this,
            delay: 1000,
            loop: true
        })

        this.triggerTimerShark = this.time.addEvent({
            callback: this.addSHARKS,
            callbackScope: this,
            delay: 3000,
            loop: true
        })
    }

    addSHARKS() {
        this.sharksGroup.create(0, Phaser.Math.Between(-1, game.config.height), "shark");
        this.sharksGroup.setVelocityX(gameOptions.dudeSpeed / 6)

    }

    addGround() {
        this.groundGroup.create(Phaser.Math.Between(0, game.config.width), 0, "ground");
        this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 6)


        if(Phaser.Math.Between(0, 1)) {
            this.starsGroup.create(Phaser.Math.Between(0, game.config.width), 0, "star");
            this.starsGroup.setVelocityY(gameOptions.dudeSpeed)
        }
    }

    addREDStars() {
        if(Phaser.Math.Between(0, 1)) {
            this.starsGroupRED.create(Phaser.Math.Between(0, game.config.width), 0, "starRED");
            this.starsGroupRED.setVelocityY(gameOptions.dudeSpeed)
        }
    }

    addPURPLEStars() {
        if(Phaser.Math.Between(0, 1)) {
            this.starsGroupPURPLE.create(Phaser.Math.Between(0, game.config.width), 0, "starPURPLE");
            this.starsGroupPURPLE.setVelocityY(gameOptions.dudeSpeed)
        }

        if(Phaser.Math.Between(0, 1)) {
            this.jetpackGroup.create(Phaser.Math.Between(0, game.config.width), 0, "jetpack");
            this.jetpackGroup.setVelocityY(gameOptions.dudeSpeed)
        }
    }

    addBOMBS(){
        if(Phaser.Math.Between(0, 1)) {
            this.bombGroup.create(Phaser.Math.Between(0, game.config.width), 0, "bomb");
            this.bombGroup.setVelocityY(gameOptions.dudeSpeed)
        }
    }

    bombEXPLODE() {
        this.scoreText.setText("Your score was: " + this.score);
        this.stopTimers()
        this.gameEndText.setVisible(true);
        this.scoreText.setVisible(true);
        this.startText.setVisible(true);
        this.physics.pause();
        this.dude.setTint(0xff0000);
        this.jetpackActive = false
        this.input.on('pointerdown', () => {
            this.scene.start("PlayGame")
        })

    }


    collectStar(dude, star) {
        star.disableBody(true, true)
        this.score += 1
        this.scoretextFullTime.setText(this.score)
    }

    collectStarRED(dude, star) {
        star.disableBody(true, true)
        this.score += 5
        this.scoretextFullTime.setText(this.score)
    }

    collectStarPURPLE(dude, star) {
        star.disableBody(true, true)
        this.score += 10
        this.scoretextFullTime.setText(this.score)
    }

    flymodeActivate(dude, jetpack) {
        jetpack.disableBody(true, true)
        
        if (!this.jetpackActive) {
            this.jetpackActive = true
            this.jetpackActivate.setVisible(true);
            this.jetpackActivate.setPosition(this.dude.x, this.dude.y);
            this.timerJetpackImage.setVisible(true)

            this.time.delayedCall(this.jetpackDuration, () => {
                this.jetpackActive = false
                this.jetpackActivate.setVisible(false)
                this.timerJetpackImage.setVisible(false)
            });
        }
    }

    sharkgoKILL() {
        this.scoreText.setText("Your score was: " + this.score);
        this.stopTimers()
        this.gameEndText.setVisible(true);
        this.scoreText.setVisible(true);
        this.startText.setVisible(true);
        this.physics.pause();
        this.dude.setTint(0xff0000);
        this.jetpackActive = false
        this.input.on('pointerdown', () => {
            this.scene.start("PlayGame")
        })

    }

    stopTimers() {
        if (this.triggerTimer) this.triggerTimer.remove();
        if (this.triggerTimerREDSTAR) this.triggerTimerREDSTAR.remove();
        if (this.triggerTimerPURPLESTAR) this.triggerTimerPURPLESTAR.remove();
        if (this.triggerTimerBOMB) this.triggerTimerBOMB.remove();
        if (this.triggerTimerShark) this.triggerTimerShark.remove();
    }

    update(){
        if(this.cursors.left.isDown){
            this.dude.body.velocity.x = -gameOptions.dudeSpeed
            this.dude.anims.play("left", true)
        }

        else if(this.cursors.right.isDown){
            this.dude.body.velocity.x = gameOptions.dudeSpeed
            this.dude.anims.play("right", true)
        }

        else {
            this.dude.body.velocity.x = 0;
            this.dude.anims.play("turn",true)
        }

        if(this.cursors.up.isDown && this.dude.body.touching.down){
            this.dude.body.velocity.y = -gameOptions.dudeGravity / 1.6
        }

        if (this.jetpackActive) {
            if (this.cursors.up.isDown){
                this.dude.body.velocity.y = -gameOptions.dudeGravity
            }
        }
        

        if(this.dude.y > game.config.height || this.dude.y < 0) {
            this.scoreText.setText("Your score was: " + this.score)
            this.gameEndText.setVisible(true)
            this.scoreText.setVisible(true)
            this.startText.setVisible(true)
            this.physics.pause()
            this.stopTimers();
            this.dude.setTint(0xff0000);
            this.jetpackActive = false
            this.input.on('pointerdown', () => {
            this.scene.start("PlayGame")
        })
        }

        if (this.jetpackActive) {
            this.jetpackActivate.setPosition(this.dude.x, this.dude.y)
        }
    }

}



// SÄÄSTÄ LENTOA VARTEN        if(this.cursors.up.isDown){
          //  this.dude.body.velocity.y = -gameOptions.dudeGravity
    //    }
    