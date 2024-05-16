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
    const topLeft = {
      x: this.loc.x - this.size.w / 2,
      y: this.loc.y - this.size.h / 2,
    };
    console.log("bounds test", loc, topLeft, this.size);
    if (
      loc.x >= topLeft.x &&
      loc.x <= topLeft.x + this.size.w &&
      loc.y >= topLeft.y &&
      loc.y <= topLeft.y + this.size.h
    ) {
      return true;
    }
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
