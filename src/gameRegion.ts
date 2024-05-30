/**
 * A game region
 */

"use strict";

import { ObjSize } from "./lib/models";
import { GameGrid } from "./gameGrid";
import { GameCell } from "./gameCell";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ShapeGrid, ShapeGridElement } from "./shapeGrid";

/**
 * A game region
 */
export class GameRegion extends ShapeGridElement {
  draw() {
    this.drawBorder("white");
  }
  redraw(): void {
    this.draw();
  }
}

/**
 * A region for the game board (dim x dim)
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class RegionGrid extends ShapeGrid {
  gameGrid: GameGrid; // Pointer to the parent game grid
  value: number | undefined = undefined; // for debugging purposes

  // Draw the region cells according to parameters
  draw() {
    this.drawText(String(this.value), "white");

    // Add a border around the region
    // this.drawBorder("white");
  }

  // Redraw the game region (used when the parent is resized)
  redraw() {
    // account for size changes
    this.redraw();
    this.draw();
  }

  constructor(gridDim: ObjSize, param: ShapeNodeParameters, parent?: GameGrid) {
    super(GameCell, gridDim, param, parent);
    this.gameGrid = this.parent as GameGrid;
    this.gridDim = this.gameGrid?.gridDim || { w: 100, h: 100 };
  }
}
