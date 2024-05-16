/**
 * A game grid
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize } from "./lib/models";
import { ShapeNode } from "./shapeNode";
import { CellGrid } from "./cellGrid";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class GameGrid extends ShapeNode {
  dim: number;

  // For now, just a single cell
  cellGrid: CellGrid;

  // Draw the game grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    this.cellGrid.draw(ctx);
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
    this.draw(ctx);
  }

  constructor(gridSize: number, loc: Coords, size: ObjSize) {
    super(loc, size);

    // ensure that the size is a perfect square
    const dim = Math.sqrt(gridSize);
    if (gridSize !== dim * dim) {
      throw new Error("Size must be a perfect square");
    }
    this.dim = dim;

    // For now, just pass through a cell grid so we can work on it
    this.cellGrid = new CellGrid(this.loc, this.size, this);
  }
}
