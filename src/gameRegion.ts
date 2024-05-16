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
  num: number;

  // 2-D array of cell grids
  cellGrid: CellGrid[][] = [];

  // Draw the game region according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    // Initialize the cells
    console.log(
      `Initializing cell grid (region ${this.num}) dim = ${this.dim}`
    );
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.cellGrid?.[i]) this.cellGrid[i] = [];
        // If the grid cell doesn't exist, create a new cell
        if (!this.cellGrid[i]?.[j]) {
          this.cellGrid[i][j] = new CellGrid(
            j * this.dim + i + 1,
            { x: 0, y: 0 },
            { h: 0, w: 0 },
            this
          );
        }
      }
    }

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
    this.draw(ctx); // Create the cells if they don't exist yet

    // console.log("gameRegion redraw size:", this.loc, this.size);
    for (const i of this.cellGrid) {
      for (const j of i) {
        j.redraw(ctx);
      }
    }
  }

  constructor(num: number, loc: Coords, size: ObjSize, parent: GameGrid) {
    super(loc, size, parent);
    this.dim = parent?.dim;
    this.num = num;

    // For now, just pass through a cell grid so we can work on it
    this.cellGrid[0] = [];
  }
}
