class Bird extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setGravityY(800);
        this.isFlapping = false;
        this.jumpForce = -350;
        this.jumpAvailable = true;
        this.jumpTimer = null;
        this.setInteractive();
        this.on('pointerdown', this.flap, this);
    }

    flap() {
        console.log('Flap method called');
        if (!this.jumpAvailable) return;
    
        this.setVelocityY(this.jumpForce);
        this.isFlapping = true;
        this.jumpAvailable = false;
    
        this.scene.tweens.add({
            targets: this,
            angle: -20,
            duration: 100,
            yoyo: true
        });
    
        this.jumpTimer = this.scene.time.delayedCall(300, () => {
            this.jumpAvailable = true;
        });
    }
    

    update() {
        // If bird hits the ground, game is over
        if (this.y > this.scene.sys.game.config.height - this.height) {
            this.scene.gameOver();
        }
      
        // Adjust the bird's angle depending on its velocity
        this.angle = this.body.velocity.y > 0 ? 20 : -20;
        this.isFlapping = false;
    }
    
    
    

    destroy() {
        this.jumpTimer?.remove();
        super.destroy();
    }
}

export default Bird; 
