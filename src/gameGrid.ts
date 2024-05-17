/**
 * A game grid
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize } from "./lib/models";
import { ShapeNode } from "./shapeNode";
import { GameRegion } from "./gameRegion";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class GameGrid extends ShapeNode {
  dim: number;

  // 2-D array of game regions
  gameRegion: GameRegion[][] = [];

  // Draw the game grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    for (const i of this.gameRegion) {
      for (const j of i) {
        j.draw(ctx);
      }
    }
    // Add a border
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.loc.x, this.loc.y, this.size.w, this.size.h);
  }

  redraw(ctx: CanvasRenderingContext2D) {
    const pctSize = 0.75;
    const boardSize: ObjSize = {
      w: Math.floor(ctx.canvas.width * pctSize),
      h: Math.floor(ctx.canvas.height * pctSize),
    };
    this.loc = {
      x: (ctx.canvas.width - boardSize.w) / 2,
      y: (ctx.canvas.height - boardSize.h) / 2,
    };
    this.size = boardSize;
    console.log(
      `gameGrid.redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );

    // console.log("gameGrid redraw:", this.loc, this.size);
    for (const i of this.gameRegion) {
      for (const j of i) {
        j.redraw(ctx);
      }
    }

    this.draw(ctx);
  }

  constructor(gridSize: number, loc: Coords, size: ObjSize) {
    super(loc, size);
    // ensure they didn't ask for something stupid
    if (gridSize <= 0) {
      throw new Error("Size must be greater than 0");
    }

    // ensure that the size is a perfect square
    const dim = Math.sqrt(gridSize);
    if (gridSize !== dim * dim) {
      throw new Error("Size must be a perfect square");
    }
    this.dim = dim;

    // Initialize the regions
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.gameRegion?.[i]) this.gameRegion[i] = [];
        // If the grid region doesn't exist, create a new cell
        if (!this.gameRegion[i]?.[j]) {
          this.gameRegion[i][j] = new GameRegion(
            j * this.dim + i + 1,
            { x: 0, y: 0 },
            { h: 0, w: 0 },
            this
          );
        }
      }
    }
  }
}
