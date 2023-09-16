import { fetchCircles } from './Circle';
import type { ICircle } from './types';

describe('getCircleData', () => {
  let circles: ICircle[];

  beforeAll(async () => {
    circles = await fetchCircles();

    jest.clearAllMocks();
  });

  test('Should return an array', async () => {
    expect(Array.isArray(circles)).toBe(true);
  });

  test('Should return an array of length greater than 0', async () => {
    expect(circles.length).toBeGreaterThan(0);
  });

  test('Should return an array of objects', async () => {
    expect(typeof circles[0]).toBe('object');
  });

  test('Should return an array of objects with name and value properties', async () => {
    expect(circles[0]).toHaveProperty('name');
    expect(circles[0]).toHaveProperty('value');
  });
});
