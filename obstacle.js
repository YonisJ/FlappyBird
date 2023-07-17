class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityX(-200);
        this.body.setSize(64, 320, true); 
        this.body.setOffset(0, 32);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.passed = false; 
    }

    update() {
        if (this.getBounds().right < 0) {
            this.destroy();
        }
    }

    destroy() {
        this.disableBody(true, false);
    }
}

export default Obstacle;
