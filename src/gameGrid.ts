/**
 * A game grid
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ObjSize } from "./lib/models";
import { GameRegion } from "./gameRegion";
import { ShapeGrid } from "./shapeGrid";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: dimension of the puzzle (eg: 1, 2, 3)
 */
export class GameGrid extends ShapeGrid {
  gridDim: ObjSize;

  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: ShapeNode
  ) {
    super(GameRegion, gridDim, param, parent);
    this.gridDim = gridDim;
    this.name = "gameGrid";
    this.borderColor = "#10cf10";
    this.divColor = "lightGray";
    this.fillColor = "";
    this.textColor = "white";

    // this.gameRegions = this.shapeGrid as GameRegion[][];
    // ensure they didn't ask for something stupid
    if (gridDim.w <= 0 || gridDim.h <= 0) {
      throw new Error("Grid dimensions must be greater than 0");
    }
  }
}
