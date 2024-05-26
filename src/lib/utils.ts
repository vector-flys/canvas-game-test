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
