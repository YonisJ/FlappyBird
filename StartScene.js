class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('bg1', 'bg1.png');
        this.load.image('bg2', 'bg2.png');
        this.load.spritesheet('bird', 'bird.png', { frameWidth: 60, frameHeight: 45 });
    }

    create() {
        this.addParallaxBackground();
    
        this.bird = this.physics.add.sprite(100, this.sys.game.config.height / 2, 'bird');
        this.bird.setGravityY(200);
    
        this.tweens.add({
            targets: this.bird,
            y: '+=50', // Reduced the distance for the bird's up and down movement
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    
        const playButton = this.add.text(400, 300, 'PLAY GAME', { fontSize: '32px', fill: '#888888' }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            playButton.setInteractive(false);
            let countdown = this.add.text(400, 400, '3', { fontSize: '48px', fill: '#000' }).setOrigin(0.5);
            this.time.addEvent({
                delay: 1000,
                repeat: 2,
                callback: () => {
                    let countdownValue = parseInt(countdown.text) - 1;
                    countdown.setText(countdownValue.toString());
                    
                },
                callbackScope: this,
                onComplete: () => {
                    console.log("Game scene should start here")
                    this.scene.start('GameScene');
                    console.log("Game scene")
                    playButton.setInteractive(); // Enables interaction with the button again after the countdown
                }
            });
        }, this);
    }

    addParallaxBackground() {
        this.bgLayer1 = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg1');
        this.bgLayer1.setOrigin(0, 0);
        this.bgLayer2 = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg2');
        this.bgLayer2.setOrigin(0, 0);
    }

    update() {
        this.bgLayer1.tilePositionX += 0.5;
        this.bgLayer2.tilePositionX += 1;
    }
}

export default StartScene;
