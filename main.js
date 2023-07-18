import GameScene from './gameScene.js';
import GameOverScene from './GameOverScene.js';
import StartScene from './StartScene.js';

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
    scene: [StartScene, GameScene, GameOverScene],
};

const game = new Phaser.Game(config);
