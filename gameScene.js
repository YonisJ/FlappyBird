import Bird from './bird.js';
import Obstacle from './obstacle.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.scoreText;
        this.obstacleGroup;
        this.obstacleTimer;
        this.isGameStarted = false; 
        this.startButton;
        this.countdownText;
        this.countdown;
        this.birdHoverTween;
    }

    // Preloads assets for the game
    preload() {
        console.log('GameScene preload');
        this.load.image('bird', 'bird.png');
        this.load.image('obstacle', 'obstacle.png');
        this.load.image('bg1', 'bg1.png');
        this.load.image('bg2', 'bg2.png');
        this.load.image('play', 'play.png'); 
    }

    // Creates the game entities
    create() {
        console.log('GameScene create');
        this.addParallaxBackground();

        // Ground has been lowered
        this.ground = this.add.tileSprite(0, this.sys.game.config.height, this.sys.game.config.width, 60, 'bg1');
        this.ground.setOrigin(0, 1);
        this.physics.add.existing(this.ground, true);

        this.bird = this.physics.add.sprite(100, this.sys.game.config.height / 2, 'bird');
        this.bird.setGravityY(0);
        this.isBirdFalling = false;

        // Hover effect is more subtle
        this.birdHoverTween = this.tweens.add({
            targets: this.bird,
            y: '+=5',
            duration: 500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

    
        this.obstacleGroup = this.physics.add.group({ classType: Obstacle });
    
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    
        this.physics.add.overlap(this.bird, this.obstacleGroup, this.gameOver, null, this);
        this.physics.add.collider(this.bird, this.ground, this.gameOver, null, this);
    
        this.startButton = this.add.text(400, 300, 'Click to Play', { font: "50px Arial", fill: "#000000", align: "center" }).setInteractive();
        this.startButton.on('pointerdown', () => this.startCountdown());
    
        this.countdownText = this.add.text(400, 300, '', { fontSize: '64px', fill: '#000' }).setOrigin(0.5);
    
        this.input.on('pointerdown', this.controlBird, this);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceKey.on('down', this.controlBird, this);
    }
    
    controlBird() {
        if (this.isGameStarted || this.isBirdFalling) {
            this.bird.setVelocityY(-350);
        }        
    }
    
    update() {
        if (this.isGameStarted) {
            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.bird.setVelocityY(-350);
            }
    
            this.bird.update();
            this.updateParallaxBackground();
    
            // make the ground move
            this.ground.tilePositionX += 4;
    
            this.obstacleGroup.getChildren().forEach((obstacle) => {
                obstacle.update();
                if(obstacle.getBounds().right < this.bird.getBounds().left && !obstacle.passed){
                    obstacle.passed = true;
                    this.increaseScore();
                }
            });
        } else {
            // If the bird falls down or flies too high while the game has not started, reposition it at the vertical middle of the scene
            if (this.bird.y < 100 || this.bird.y > this.sys.game.config.height - this.bird.height - this.ground.height) {
                this.bird.y = this.sys.game.config.height / 2;
                this.bird.setVelocityY(0);
            }
        }
    }
    
    startCountdown() {
        this.startButton.setVisible(false);
        let counter = 3;
        this.countdownText.setText(counter);
        this.isBirdFalling = true;
        
        this.countdown = this.time.addEvent({
            delay: 1000,
            callback: () => {
                counter--;
                if(counter === 0) {
                    this.startGame();
                    this.countdownText.setText('');
                } else {
                    this.countdownText.setText(counter);
                }
            },
            callbackScope: this,
            repeat: 2
        });
    }

    startGame() {
        this.isGameStarted = true;
        this.birdHoverTween.remove(); 
        this.bird.setVelocityY(-350);
    
        this.obstacleTimer = this.time.addEvent({
            delay: 2000,
            callback: this.generateObstacle,
            callbackScope: this,
            loop: true
        });
    }

    generateObstacle() {
        const gapPosition = Phaser.Math.Between(100, 400); // Random position for gap
        const gapSize = 200; // Size of gap

        // Upper obstacle
        const upperObstacle = this.obstacleGroup.get(800, gapPosition - gapSize / 2, 'obstacle');
        if (upperObstacle) {
            upperObstacle.setActive(true).setVisible(true);
            upperObstacle.enableBody(true, upperObstacle.x, upperObstacle.y, true, true);
            upperObstacle.setVelocityX(-200);
            upperObstacle.passed = false; 
            upperObstacle.setFlipY(true); // Flip to make it look like a top pipe
        }

        // Lower obstacle
        const lowerObstacle = this.obstacleGroup.get(800, gapPosition + gapSize / 2, 'obstacle');
        if (lowerObstacle) {
            lowerObstacle.setActive(true).setVisible(true);
            lowerObstacle.enableBody(true, lowerObstacle.x, lowerObstacle.y, true, true);
            lowerObstacle.setVelocityX(-200);
            lowerObstacle.passed = false;
        }
    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }

    gameOver() {
        this.scene.start('GameOverScene', { score: this.score });
        this.physics.pause();

        // Clear the obstacle group to avoid collision callback being called after game over
        this.obstacleGroup.clear(true, true);

        // Reset score
        this.score = 0;
    }

    addParallaxBackground() {
        this.bgLayer1 = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg1');
        this.bgLayer1.setOrigin(0, 0);
        this.bgLayer2 = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg2');
        this.bgLayer2.setOrigin(0, 0);
    }
    
    updateParallaxBackground() {
        // Scroll both layers, one slower than the other to create the parallax effect
        this.bgLayer1.tilePositionX += 0.5;
        this.bgLayer2.tilePositionX += 1;
    }
}

export default GameScene;
