/**
 * A game grid
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ShapeGrid } from "./shapeGrid";
import { ObjSize } from "./lib/models";
import { GameRegion } from "./gameRegion";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: dimension of the puzzle (eg: 1, 2, 3)
 */
export class GameGrid extends ShapeGrid {
  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: ShapeNode
  ) {
    super(GameRegion, gridDim, param, parent);
    // ensure they didn't ask for something stupid
    if (gridDim.w <= 0 || gridDim.h <= 0) {
      throw new Error("Grid dimensions must be greater than 0");
    }
    this.fill("white");
  }
}
