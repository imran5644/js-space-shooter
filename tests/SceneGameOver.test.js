import SceneGameOver from '../src/scenes/SceneGameOver';

test('should be type of function', () => {
  expect(typeof SceneGameOver).toBe('function');
});

test('should be type of function', () => {
  expect(typeof SceneGameOver).not.toBe('array');
});

test('SceneGameOver is not a subclass of container', () => {
  expect(SceneGameOver.prototype instanceof Phaser.GameObjects.Container).not.toBe(true);
});

test('SceneGameOver is a subclass of container', () => {
  expect(SceneGameOver.prototype instanceof Phaser.GameObjects.Container).toBe(false);
});