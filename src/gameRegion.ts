/**
 * A game region
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize } from "./lib/models";
import { GameGrid } from "./gameGrid";
import { GameCell } from "./gameCell";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { numToCoords, offXY } from "./lib/utils";

/**
 * A region for the game board (dim x dim)
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class GameRegion extends ShapeNode {
  dim: number; // Dimension of game region matrix (eg 3 = 3x3)
  gridDim: number; // Dimension of grid (eg 9 = 3x3)
  num: number;
  value: number | undefined = undefined; // for debugging purposes

  gridSize: ObjSize = { w: 0, h: 0 };

  // 2-D array of cell grids
  gameCell: GameCell[][] = [];

  // Draw the region cells according to parameters
  draw(ctx: CanvasRenderingContext2D) {
    if (this?.value) {
      this.drawText(String(this.value), "white");
    } else {
      for (const i of this.gameCell) {
        for (const j of i) {
          j.draw(ctx);
        }
      }
    }

    // Add a border around the region
    // this.drawBorder("white");
  }

  // Redraw the game region (used when the parent is resized)
  redraw(ctx: CanvasRenderingContext2D) {
    this.loc = this?.parent?.loc || { x: 0, y: 0 };
    this.size = this?.parent?.size || {
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };
    this.setSize({
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    });
    this.gridSize = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    // adjust location for region number
    const base = this?.parent?.loc || { x: 0, y: 0 };
    const cdOff = this.dim === 1 ? 0 : (this.dim - 1) / 2; // 1 = 0, 2 = 0.5, 3 = 1, 4 = 1.5
    const off = offXY(this.num, this.gridDim);
    this.setLoc({
      // x: base.x + this.size.w * ((this.num - 1) % this.dim) - xB,
      x: base.x + cdOff * this.size.w * off.x,
      y: base.y + cdOff * this.size.h * off.y,
    });
    console.log(
      `gameRegion[${this.num}~${Math.floor(cdOff)}].redraw([${this.loc.x}, ${
        this.loc.y
      }] ${this.size.w}x${this.size.h})`
    );
    // console.log(
    //   `gameRegion[${this.num}].redraw(${ci},${ri})@${this.size.w}x${this.size.h}`
    // );
    this.fill("green");
    this.drawBorder("white");
    this.value = this.num;
    return;

    // console.log("gameRegion redraw size:", this.loc, this.size);
    for (const i of this.gameCell) {
      for (const j of i) {
        // j.value = j.num; // force cell to show value
        j.redraw(ctx);
      }
    }

    this.draw(ctx);
  }

  constructor(num: number, param: ShapeNodeParameters, parent: GameGrid) {
    super(param, parent);

    this.dim = parent?.dim;
    this.gridDim = this.dim * this.dim;
    this.num = num;

    // Initialize the cells
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.gameCell?.[i]) this.gameCell[i] = [];
        // If the grid cell doesn't exist, create a new cell
        if (!this.gameCell[i]?.[j]) {
          const num = j * this.dim + i + 1;
          this.gameCell[i][j] = new GameCell(
            num,
            {
              loc: { x: 0, y: 0 },
              size: { h: 0, w: 0 },
              name: `Cell ${num}`,
              clickable: true,
            },
            this
          );
        }
      }
    }
  }
}
