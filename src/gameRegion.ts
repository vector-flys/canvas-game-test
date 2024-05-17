/**
 * A game region
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize } from "./lib/models";
import { GameGrid } from "./gameGrid";
import { GameCell } from "./gameCell";
import { ShapeNode } from "./shapeNode";

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

  gridSize: ObjSize = { w: 0, h: 0 };

  // 2-D array of cell grids
  gameCell: GameCell[][] = [];

  // Draw the region cells according to parameters
  draw(ctx: CanvasRenderingContext2D) {
    for (const i of this.gameCell) {
      for (const j of i) {
        j.draw(ctx);
      }
    }

    // Add a border around the region
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.loc.x, this.loc.y, this.size.w, this.size.h);
  }

  // Update the game region according to its parameters
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
    this.gridSize = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    // adjust location for region number
    this.loc = {
      x: this.loc.x + this.size.w * ((this.num - 1) % this.dim),
      y: this.loc.y + this.size.h * Math.floor((this.num - 1) / this.dim),
    };
    console.log(
      `gameRegion[${this.num}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );

    // console.log("gameRegion redraw size:", this.loc, this.size);
    for (const i of this.gameCell) {
      for (const j of i) {
        j.redraw(ctx);
      }
    }

    this.draw(ctx);
  }

  constructor(num: number, loc: Coords, size: ObjSize, parent: GameGrid) {
    super(loc, size, parent);

    this.base = parent?.loc;

    this.dim = parent?.dim;
    this.num = num;

    // Initialize the cells
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.gameCell?.[i]) this.gameCell[i] = [];
        // If the grid cell doesn't exist, create a new cell
        if (!this.gameCell[i]?.[j]) {
          this.gameCell[i][j] = new GameCell(
            j * this.dim + i + 1,
            { x: 0, y: 0 },
            { h: 0, w: 0 },
            this
          );
        }
        // Set the properties of the gameCell
        const cellCenterX =
          this.gridSize.w * i + this.gridSize.w / 2 + this.base.x + this.loc.x;
        const cellCenterY =
          this.gridSize.h * j + this.gridSize.h / 2 + this.base.y + this.loc.y;
        this.gameCell[i][j].loc = { x: cellCenterX, y: cellCenterY };
        this.gameCell[i][j].size = {
          h: this.gridSize.h,
          w: this.gridSize.w,
        };
      }
    }
  }
}
