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
        console.log('GameScene preload');
        this.load.image('bird', 'bird.png');
        this.load.image('obstacle', 'obstacle.png');
        this.load.image('bg1', 'bg1.png');
        this.load.image('bg2', 'bg2.png');
    }
    
    create() {
        console.log('GameScene create');
        this.addParallaxBackground();

        this.bird = new Bird(this, 100, 300, 'bird');

        this.obstacleGroup = this.physics.add.group({ classType: Obstacle });

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.overlap(this.bird, this.obstacleGroup, this.gameOver, null, this);

        this.startGame();

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
        console.log('Game over');
        this.physics.pause();

        // Clear the obstacle group to avoid collision callback being called after game over
        this.obstacleGroup.clear(true, true);

        // Reset score
        this.score = 0;

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
