import GunShip from '../src/entities/GunShip';

test('should be type of function', () => {
  expect(typeof GunShip).toBe('function');
});

test('should be type of function', () => {
  expect(typeof GunShip).not.toBe('array');
});