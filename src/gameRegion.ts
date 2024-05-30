/**
 * A game region
 */

"use strict";

import { ShapeNodeParameters } from "./shapeNode";
import { ShapeGrid, ShapeGridElement } from "./shapeGrid";
import { ObjSize } from "./lib/models";
import { GameGrid } from "./gameGrid";
import { GameCell } from "./gameCell";

/**
 * A game region
 */
export class GameRegion extends ShapeGridElement {
  draw() {
    console.log(
      `region[${this.name}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );
    this.drawBorder("white");
  }
  redraw(): void {
    console.log(
      `region[${this.name}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );
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
  // gameGrid: GameGrid; // Pointer to the parent game grid
  value: number | undefined = undefined; // for debugging purposes

  // Draw the region cells according to parameters
  draw() {
    console.log(
      `regionGrid[${this.name}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );
    this.drawText(String(this.value), "white");

    // Add a border around the region
    // this.drawBorder("white");
  }

  constructor(gridDim: ObjSize, param: ShapeNodeParameters, parent?: GameGrid) {
    super(GameCell, gridDim, param, parent);
    // this.gameGrid = this.parent as GameGrid;
    // this.gridDim = this.gameGrid?.gridDim || { w: 100, h: 100 };
  }
}
