/**
 * A game grid
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize } from "./lib/models";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { GameRegion } from "./gameRegion";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: dimension of the puzzle (eg: 1, 2, 3)
 */
export class GameGrid extends ShapeNode {
  dim: number;

  // 2-D array of game regions
  gameRegion: GameRegion[][] = [];

  // Draw the game regions according to parameters
  draw(ctx: CanvasRenderingContext2D) {
    for (const i of this.gameRegion) {
      for (const j of i) {
        j.draw(ctx);
      }
    }
    // Add a border around the game grid
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.loc.x, this.loc.y, this.size.w, this.size.h);
  }

  // Redraw the game grid (used when the window is resized)
  redraw(ctx: CanvasRenderingContext2D) {
    const pctSize = 0.75; // Use 75% of the canvas
    const boardSize: ObjSize = {
      w: Math.floor(ctx.canvas.width * pctSize),
      h: Math.floor(ctx.canvas.height * pctSize),
    };

    // Center the board on the canvas
    this.loc = {
      x: (ctx.canvas.width - boardSize.w) / 2,
      y: (ctx.canvas.height - boardSize.h) / 2,
    };
    this.size = boardSize;
    this.fill("white");
    console.log(
      `gameGrid.redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );

    // Redraw the game regions
    for (const i of this.gameRegion) {
      for (const j of i) {
        j.redraw(ctx);
      }
    }

    this.draw(ctx);
  }

  constructor(dim: number, param: ShapeNodeParameters) {
    super(param);
    // ensure they didn't ask for something stupid
    if (dim <= 0) {
      throw new Error("Size must be greater than 0");
    }
    this.dim = dim;

    // Initialize the regions
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.gameRegion?.[i]) this.gameRegion[i] = [];
        // If the grid region doesn't exist, create a new cell
        if (!this.gameRegion[i]?.[j]) {
          const num = j * this.dim + i + 1;
          this.gameRegion[i][j] = new GameRegion(
            num,
            {
              loc: { x: 0, y: 0 },
              size: { h: 0, w: 0 },
              name: `Region ${num}`,
            },
            this
          );
        }
      }
    }
  }
}
