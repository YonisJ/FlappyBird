function Bird(scene, x, y, texture) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.gravity = 800;
    this.isFlapping = false;
    this.jumpForce = -350;
    this.velocityY = 0;
    this.angle = 0;
  }
  
  Bird.prototype.flap = function() {
    if (!this.isFlapping) {
      this.velocityY = this.jumpForce;
      this.isFlapping = true;
      this.angle = -20;
    }
  };
  
  Bird.prototype.update = function() {
    this.y += this.velocityY;
    this.velocityY += this.gravity / 60;
  
    if (this.y < 0 || this.y > this.scene.sys.game.config.height) {
      this.scene.gameOver();
    }
  
    if (this.velocityY > 0) {
      this.angle = 20;
    } else {
      this.angle = -20;
    }
  
    this.isFlapping = false;
  };

  function Obstacle(scene, x, y, texture) {
    Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVelocityX(-200);
    this.body.setSize(64, 320, true);
    this.body.setOffset(0, 32);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }
  
  Obstacle.prototype = Object.create(Phaser.Physics.Arcade.Sprite.prototype);
  Obstacle.prototype.constructor = Obstacle;

  function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
    this.score = 0;
    this.scoreText;
    this.obstacleGroup;
  }
  
  GameScene.prototype = Object.create(Phaser.Scene.prototype);
  GameScene.prototype.constructor = GameScene;
  
  GameScene.prototype.preload = function() {
    this.load.image('bird', 'flappy-bird.png');
    this.load.image('obstacle', 'flappybird-pipe.png');
    // Load other assets
  };
  
  GameScene.prototype.create = function() {
    this.bird = new Bird(this, 100, 300, 'bird');
    this.obstacleGroup = this.physics.add.group({ classType: Obstacle });
  
    this.generateObstacle();
  
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  
    this.physics.add.collider(this.bird, this.obstacleGroup, this.gameOver, null, this);
  };
  
  GameScene.prototype.update = function() {
    this.bird.update();
  
    this.obstacleGroup.getChildren().forEach((obstacle) => {
      if (obstacle.getBounds().right < 0) {
        obstacle.setActive(false).setVisible(false);
        obstacle.body.enable = false;
        this.obstacleGroup.killAndHide(obstacle);
        this.obstacleGroup.remove(obstacle);
        this.increaseScore();
      }
    });
  };
  
  GameScene.prototype.generateObstacle = function() {
    const obstacle = this.obstacleGroup.get(800, Phaser.Math.Between(100, 500), 'obstacle');
    obstacle.setActive(true).setVisible(true);
    obstacle.body.enable = true;
    obstacle.setVelocityX(-200);
  };
  
  GameScene.prototype.increaseScore = function() {
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
  };
  
  GameScene.prototype.gameOver = function() {
    this.physics.pause();
    this.scene.stop('GameScene');
    this.scene.start('GameOverScene', { score: this.score });
  };

  module.exports = {
    Bird: Bird,
    Obstacle: Obstacle,
    GameScene: GameScene
  };