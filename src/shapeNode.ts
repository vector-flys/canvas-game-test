/**
 * A generic class for shape nodes
 */

import { Coords, ObjSize, CellShapes } from "./lib/models";

export class ShapeNode {
  base: Coords; // The base location of the node for children
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
    // console.log("bounds test", loc, topLeft, this.size);

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
    // Children will use base as (0, 0)
    this.base = parent?.loc || { x: 0, y: 0 };

    this.loc = loc;
    this.size = size;
    this.parent = parent;
  }
}
