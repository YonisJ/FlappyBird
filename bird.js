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

        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceKey.on('down', this.flap, this);
        
        // Set the initial bird position in the middle of the game screen
        this.y = scene.sys.game.config.height / 2;
        this.x = 64;  
    }

    flap() {
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
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;
    
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    
        if (this.y > this.scene.sys.game.config.height - this.height) {
            this.scene.gameOver();
        }
        
        this.angle = this.body.velocity.y > 0 ? 20 : -20;
        this.isFlapping = false;
    }
    
    destroy() {
        this.spaceKey.removeAllListeners();
        this.jumpTimer?.remove();
        super.destroy();
    }
}

export default Bird;
