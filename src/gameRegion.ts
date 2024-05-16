/**
 * A game region
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize } from "./lib/models";
import { ShapeNode } from "./shapeNode";
import { CellGrid } from "./cellGrid";
import { GameGrid } from "./gameGrid";

/**
 * A region for the game board (dim x dim)
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class GameRegion extends ShapeNode {
  dim: number;

  // 2-D array of cell grids
  cellGrid: CellGrid[][] = [];

  // Draw the game region according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    for (const i of this.cellGrid) {
      for (const j of i) {
        j.draw(ctx);
      }
    }
  }

  // Update the game region according to its parameters
  redraw(ctx: CanvasRenderingContext2D) {
    this.loc = this?.parent?.loc || { x: 0, y: 0 };
    this.size = this?.parent?.size || {
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };
    // console.log("gameRegion redraw size:", this.loc, this.size);
    for (const i of this.cellGrid) {
      for (const j of i) {
        j.redraw(ctx);
      }
    }
  }

  constructor(loc: Coords, size: ObjSize, parent: GameGrid) {
    super(loc, size, parent);
    this.dim = parent?.dim;

    // For now, just pass through a cell grid so we can work on it
    this.cellGrid[0] = [];
    this.cellGrid[0][0] = new CellGrid(this.loc, this.size, this);
  }
}
