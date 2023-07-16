const { Bird, Obstacle } = require('../app')

describe('Bird', () => {
  let bird;

  beforeEach(() => {
    const mockScene = { sys: { game: { config: { height: 600 } } } };
    bird = new Bird(mockScene, 0, 0, 'birdTexture');
  });

  test('flap() should set velocityY and angle', () => {
    bird.flap();
    expect(bird.velocityY).toBe(bird.jumpForce);
    expect(bird.angle).toBe(-20);
  });

  test('update() should update position and angle', () => {
    const initialY = bird.y;
    bird.velocityY = 100;
    bird.update();
    expect(bird.y).toBe(initialY + bird.velocityY);
    expect(bird.angle).toBe(20);
  });
});

describe('Obstacle', () => {
  let obstacle;

  beforeEach(() => {
    const mockScene = { physics: { add: { existing: jest.fn() } }, add: { existing: jest.fn() } };
    obstacle = new Obstacle(mockScene, 0, 0, 'obstacleTexture');
  });

  test('should have the correct properties set', () => {
    expect(obstacle.checkWorldBounds).toBe(true);
    expect(obstacle.outOfBoundsKill).toBe(true);
    // Add more assertions for other properties
  });
});
