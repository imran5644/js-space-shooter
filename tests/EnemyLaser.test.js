import EnemyLasers from '../src/entities/EnemyLaser';

test('should be a type of function', () => {
  expect(typeof EnemyLasers).toBe('function');
});

test('should be a type of function', () => {
  expect(typeof EnemyLasers).not.toBe('array');
});