import SceneMain from '../src/scenes/SceneMain';
import Phaser from 'phaser';

test('should be type of a function', () => {
  expect(typeof SceneMain).toBe('function');
});

test('should be type of a function', () => {
  expect(typeof SceneMain).not.toBe('array');
});

test('SceneMain is not a subclass of container', () => {
  expect(SceneMain.prototype instanceof Phaser.GameObjects.Container).not.toBe(true);
});

test('SceneMain is a subclass of container', () => {
  expect(SceneMain.prototype instanceof Phaser.GameObjects.Container).toBe(false);
});