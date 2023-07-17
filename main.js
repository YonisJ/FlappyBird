import GameScene from './gameScene.js';
import GameOverScene from './GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1000 },
            debug: false,
        },
    },
    dom: {
        createContainer: true
    },
    scene: [GameScene, GameOverScene],
};

const game = new Phaser.Game(config);
