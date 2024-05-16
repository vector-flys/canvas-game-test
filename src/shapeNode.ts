/**
 * A generic class for shape nodes
 */

import { Coords, ObjSize, CellShapes } from "./lib/models";

export class ShapeNode {
  loc: Coords;
  size: ObjSize;
  parent: ShapeNode | undefined;

  /**
   * Function to check if a location is within the bounds of the shape
   *
   * @param loc - x, y coordinates
   * @return boolean - true if the location is within the bounds of the shape
   */
  bounds(loc: Coords): boolean {
    console.log("bounds test", loc, this.loc, this.size);
    return false;
  }

  constructor(
    loc: Coords,
    size: ObjSize,
    parent: ShapeNode | undefined = undefined
  ) {
    this.loc = loc;
    this.size = size;
    this.parent = parent;
  }
}
