class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    init(data) {
      this.finalScore = data.score;
    }
  
    create() {
      const gameOverText = this.add.text(400, 250, 'Game Over', 
                                      { fontSize: '64px', fill: '#FF0000' }).setOrigin(0.5);
                                      
      const scoreText = this.add.text(400, 350, 'Score: ' + this.finalScore, 
                                      { fontSize: '32px', fill: '#FF0000' }).setOrigin(0.5);
                                      
      const restartText = this.add.text(400, 450, 'Click to Restart', 
                                        { fontSize: '32px', fill: '#FF0000' }).setOrigin(0.5);
                                        
      this.input.on('pointerup', () => {
        this.scene.start('GameScene');
      }, this);
    }
  }
  
  export default GameOverScene;
  