import SceneMainMenu from '../src/scenes/SceneMainMenu';

test('should be type of a function', () => {
  expect(typeof SceneMainMenu).toBe('function');
});

test('should be type of a function', () => {
  expect(typeof SceneMainMenu).not.toBe('array');
});

test('SceneMainMenu is not a subclass of container', () => {
  expect(SceneMainMenu.prototype instanceof Phaser.GameObjects.Container).not.toBe(true);
});

test('SceneMainMenu is a subclass of container', () => {
  expect(SceneMainMenu.prototype instanceof Phaser.GameObjects.Container).toBe(false);
});