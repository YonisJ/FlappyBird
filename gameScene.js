import Bird from './bird.js';
import Obstacle from './obstacle.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.scoreText;
        this.obstacleGroup;
        this.obstacleTimer;
    }

    preload() {
        this.load.on('filecomplete', function (key, type, data) {
            console.log(key, 'loading completed');
        });
    
        this.load.on('loaderror', function (file) {
            console.error('Error loading ' + file.src);
        });
    
        this.load.image('bird', 'bird.png');
        this.load.image('obstacle', 'obstacle.png');
        this.load.image('bg1', 'bg1.png');
        this.load.image('bg2', 'bg2.png');
    }
    

    create() {
        this.addParallaxBackground();

        // If the bird doesn't exist, create a new bird.
        if(!this.bird) {
            this.bird = new Bird(this, 100, 300, 'bird');
        } else {
            // If the bird exists, reset its position and velocity
            this.bird.setPosition(100, 300);
            this.bird.setVelocity(0);
            this.bird.setGravityY(800);
        }

        this.obstacleGroup = this.physics.add.group({ classType: Obstacle });

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.overlap(this.bird, this.obstacleGroup, this.gameOver, null, this);

        this.startGame();

        // Handle player input.
        this.input.on('pointerdown', () => {
            this.bird.flap();
        });
    }

    update() {
        this.bird.update();
        this.updateParallaxBackground();

        this.obstacleGroup.getChildren().forEach((obstacle) => {
          obstacle.update();
          if(obstacle.getBounds().right < this.bird.getBounds().left && !obstacle.passed){
            obstacle.passed = true;
            this.increaseScore();
          }
        });
    }

    startGame() {
        this.obstacleTimer = this.time.addEvent({
            delay: 2000,
            callback: this.generateObstacle,
            callbackScope: this,
            loop: true
        });
    }

    generateObstacle() {
        const obstacle = this.obstacleGroup.get(800, Phaser.Math.Between(100, 500), 'obstacle');
    
        if (obstacle) {
            obstacle.setActive(true).setVisible(true);
            obstacle.enableBody(true, obstacle.x, obstacle.y, true, true);
            obstacle.setVelocityX(-200);
            obstacle.passed = false; // reset the passed property when the obstacle becomes active again
        } else {
            console.log("Max group size reached.");
        }
    }

    increaseScore() {
        this.score += 1;
        this.scoreText.setText('Score: ' + this.score);
    }

    gameOver() {
        console.log('Game over');
        this.obstacleTimer.paused = true;
        this.physics.pause();
        this.scene.start('GameOverScene', { score: this.score });
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
