/**
 * A game grid
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "../shapeNode";
import { ObjSize } from "../lib/models";
import { GameRegion } from "./gameRegion";
import { ShapeGrid } from "../shapeGrid";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: dimension of the puzzle (eg: 1, 2, 3)
 */
export class GameGrid extends ShapeGrid {
  gridDim: ObjSize;

  /**
   * Override draw for the game grid
   *
   * @returns void
   */
  // draw(): void {
  //   if (!this.visible) return;
  //   const spaces = " ".repeat(this.shapeDepth() * 2);
  //   console.log(
  //     `${spaces}grid[${this.name}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
  //   );
  // }

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

    // Set the grid properties
    this.gridDim = gridDim;
    this.name = "gameGrid";
    this.borderColor = "#40cf40";
    this.divColor = "lightGray";
    this.fillColor = "";
    this.textColor = "white";
  }
}
