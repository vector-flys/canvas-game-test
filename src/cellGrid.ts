/**
 * A cell grid, which is useful for displaying possibilities
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize, CellShapes } from "./lib/models";
import { ShapeNode } from "./shapeNode";

import { NumCell } from "./numCell";
import { GameRegion } from "./gameRegion";

/**
 * Grid for possibilites within a cell
 *
 * Constructor
 *   @param gameGrid (the gameGrid on which to draw)
 *   @param loc (the location within the gameGrid)
 */
export class CellGrid extends ShapeNode {
  base: Coords = { x: 0, y: 0 }; // The base location of the gameGrid
  dim: number; // Dimension of possibilites matrix (eg 3 = 3x3)
  cellSize: ObjSize = { w: 0, h: 0 };

  // 2-D array of num cells
  grid: NumCell[][] = [];

  // Draw the cell grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    // Initialize the grid
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.grid?.[i]) this.grid[i] = [];

        // If the grid cell doesn't exist, create a new cell
        if (!this.grid[i]?.[j]) {
          this.grid[i][j] = new NumCell(
            j * this.dim + i + 1,
            { x: 0, y: 0 },
            { h: 0, w: 0 }
          );

          // Pick a rotating shape for the cell
          this.grid[i][j].cellShape =
            this.grid[i][j].num % (Object.keys(CellShapes).length / 2);
          // console.log(
          //   "Cell %s, shape =",
          //   this.grid[i][j].num,
          //   CellShapes[this.grid[i][j].cellShape]
          // );
        }

        // Set the properties of the cell
        const cellCenterX =
          this.cellSize.w * i + this.cellSize.w / 2 + this.base.x + this.loc.x;
        const cellCenterY =
          this.cellSize.h * j + this.cellSize.h / 2 + this.base.y + this.loc.y;
        this.grid[i][j].loc = { x: cellCenterX, y: cellCenterY };
        this.grid[i][j].size = {
          h: this.cellSize.h,
          w: this.cellSize.w,
        };
      }
    }

    // Now draw the possibilites
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].draw(ctx);
      }
    }
  }

  redraw(ctx: CanvasRenderingContext2D) {
    this.loc = this?.parent?.loc || { x: 0, y: 0 };
    this.size = this?.parent?.size || {
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };
    this.cellSize = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    // console.log("cellGrid cell size:", this.cellSize);
    this.draw(ctx);
  }

  // Initialize the cell grid
  constructor(loc: Coords, size: ObjSize, parent: GameRegion) {
    super(loc, size, parent);

    this.dim = parent?.dim;
  }
}
