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
  gameRegions: GameRegion[][];

  draw() {
    this.fill("red");
    for (const i of this.gameRegions) {
      for (const j of i) {
        j.draw();
      }
    }
  }

  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: ShapeNode
  ) {
    super(GameRegion, gridDim, param, parent);
    this.gameRegions = this.shapeGrid as GameRegion[][];
    // ensure they didn't ask for something stupid
    if (gridDim.w <= 0 || gridDim.h <= 0) {
      throw new Error("Grid dimensions must be greater than 0");
    }
  }
}
