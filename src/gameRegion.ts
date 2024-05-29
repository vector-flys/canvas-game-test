/**
 * A game region
 */

"use strict";

import { ObjSize } from "./lib/models";
import { GameGrid } from "./gameGrid";
import { GameCell } from "./gameCell";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ShapeGridElement } from "./shapeGrid";

/**
 * A region for the game board (dim x dim)
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class GameRegion extends ShapeGridElement {
  gridDim: ObjSize; // Dimension of grid (eg 3x3)
  gameGrid: GameGrid;
  num: number;
  value: number | undefined = undefined; // for debugging purposes

  gridSize: ObjSize = { w: 0, h: 0 };

  // 2-D array of cell grids
  gameCell: GameCell[][] = [];

  // Draw the region cells according to parameters
  draw() {
    this.drawText(String(this.value), "white");

    // Add a border around the region
    // this.drawBorder("white");
  }

  // Redraw the game region (used when the parent is resized)
  redraw() {
    // account for size changes
    this.draw();
  }

  constructor(num: number, param: ShapeNodeParameters, parent?: ShapeNode) {
    super(num, param, parent);
    this.gameGrid = this.parent as GameGrid;

    this.gridDim = this.gameGrid?.gridDim || { w: 100, h: 100 };
    this.num = num;

    // Initialize the cells
  }
}
