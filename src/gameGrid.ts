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
    // console.log("gameGrid redraw:", this.loc, this.size);
    for (const i of this.gameRegion) {
      for (const j of i) {
        j.redraw(ctx);
      }
    }
  }

  constructor(gridSize: number, loc: Coords, size: ObjSize) {
    super(loc, size);

    // ensure that the size is a perfect square
    const dim = Math.sqrt(gridSize);
    if (gridSize !== dim * dim) {
      throw new Error("Size must be a perfect square");
    }
    this.dim = dim;

    // For now, just one region
    this.gameRegion[0] = [];
    this.gameRegion[0][0] = new GameRegion(1, this.loc, this.size, this);
  }
}
