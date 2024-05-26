/**
 * Utilities
 */

import { Coords } from "./models";

// Is the argument an object?
export const isObject = (object: any) => {
  return object != null && typeof object === "object";
};

export const objEqual = (object1: any, object2: any) => {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !objEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Function to sleep specified time
 *
 * @param ms - number of milliseconds to sleep
 * @returns
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert a number to x, y
 *
 * @param num - number to convert
 * @param size - size of the grid
 * @returns Coords
 */
export function numToCoords(num: number, size: number): Coords {
  const dim = Math.sqrt(size);
  return {
    x: (num % size) % dim,
    y: Math.floor((num % size) / dim),
  };
}

/**
 * Convert x, y to a number
 *
 * @param coords - Coords to convert
 * @param size - size of the grid
 * @returns number
 */
export function coordsToNum(coords: Coords, size: number): number {
  const dim = Math.sqrt(size);
  return coords.x + coords.y * dim;
}
/**
 * Calculate x, y offset based on number
 * @param n
 * @returns Coords
 */
export function offXY(n: number, size: number): Coords {
  const dim = Math.sqrt(size);

  if (n < 1 || n > dim * dim) throw new Error(`Invalid number: ${n}`);
  const { x, y } = numToCoords(n - 1, size);
  const off = { x: 0, y: 0 };

  process.stdout.write(`${n.toString().padStart(2, "0")}: (${x}, ${y}), `);
  // If the dimension is even
  if (dim % 2 === 0) {
    const max = dim / 2;
    // process.stdout.write("even");
    off.x = x % dim < dim / 2 ? -1 : 1;
    if (x === 0 || x === dim - 1) off.x *= max;

    off.y = y % dim < dim / 2 ? -1 : 1;
    if (y === 0 || y === dim - 1) off.y *= max;
  } else {
    // process.stdout.write("odd");
    const nCount = Math.floor(dim / 2);
    off.x = x - nCount;
    off.y = y - nCount;
  }
  return off;
}
