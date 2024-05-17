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
  base: Coords = { x: 0, y: 0 }; // The base location of the gameRegion
  dim: number; // Dimension of possibilites matrix (eg 3 = 3x3)
  num: number;
  cellSize: ObjSize = { w: 0, h: 0 };

  // 2-D array of num cells
  grid: NumCell[][] = [];

  // Draw the cell grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    // Now draw the possibilites
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        // Set the properties of the numCell
        const cellCenterX =
          this.cellSize.w * i + this.cellSize.w / 2 + this.base.x + this.loc.x;
        const cellCenterY =
          this.cellSize.h * j + this.cellSize.h / 2 + this.base.y + this.loc.y;
        this.grid[i][j].loc = { x: cellCenterX, y: cellCenterY };
        this.grid[i][j].size = {
          h: this.cellSize.h,
          w: this.cellSize.w,
        };

        this.grid[i][j].draw(ctx);
      }
    }

    // Add a border
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.loc.x, this.loc.y, this.size.w, this.size.h);
  }

  redraw(ctx: CanvasRenderingContext2D) {
    this.loc = this?.parent?.loc || { x: 0, y: 0 };
    this.size = this?.parent?.size || {
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };
    this.size = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    this.cellSize = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    // adjust location for cell number
    this.loc = {
      x: this.loc.x + this.size.w * ((this.num - 1) % this.dim),
      y: this.loc.y + this.size.h * Math.floor((this.num - 1) / this.dim),
    };
    // console.log(
    //   `cellGrid[${this.num}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );

    this.draw(ctx);
  }

  // Initialize the cell grid
  constructor(num: number, loc: Coords, size: ObjSize, parent: GameRegion) {
    super(loc, size, parent);
    this.base = parent?.base;

    this.dim = parent?.dim;
    this.num = num;
    // Initialize the grid
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.grid?.[i]) this.grid[i] = [];

        // If the num cell doesn't exist, create a new cell
        if (!this.grid[i]?.[j]) {
          this.grid[i][j] = new NumCell(
            j * this.dim + i + 1,
            { x: 0, y: 0 },
            { h: 0, w: 0 },
            this
          );

          // // Pick a rotating shape for the cell
          // this.grid[i][j].cellShape =
          //   this.grid[i][j].num % (Object.keys(CellShapes).length / 2);
        }
      }
    }
  }
}
