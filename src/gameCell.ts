/**
 * A game cell
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ShapeGrid, ShapeGridElement } from "./shapeGrid";
import { ObjSize } from "./lib/models";
import { GameRegion } from "./gameRegion";

/**
 * A game cell
 */
export class GameCell extends ShapeGridElement {
  draw() {
    console.log(
      `         cell[${this.name}].draw([${Math.floor(
        this.loc.x
      )}, ${Math.floor(this.loc.y)}] ${Math.floor(this.size.w)}x${Math.floor(
        this.size.h
      )})`
    );
    this.drawBorder("gray");
  }
  redraw(): void {
    console.log(
      `         cell[${this.name}].redraw([${Math.floor(
        this.loc.x
      )}, ${Math.floor(this.loc.y)}] ${Math.floor(this.size.w)}x${Math.floor(
        this.size.h
      )})`
    );
    this.draw();

    // // redraw all the children
    // for (const child of this.children as any) {
    //   if (child?.redraw) child.redraw();
    // }
  }
}

/**
 * A cell for the game board (dim x dim)
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class CellGrid extends ShapeNode {
  cellGrid: ShapeGrid;
  gridDim: ObjSize;
  // gameGrid: GameGrid; // Pointer to the parent game grid
  value: number | undefined = undefined; // for debugging purposes

  // Draw the cell cells according to parameters
  draw() {
    console.log(
      `       ${this.name}.draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`,
      "- parent:",
      this.parent?.name,
      ", children:",
      this.children.length
    );
    // this.drawText(String(this.value), "white");
    // Add a border around the cell grid
    // this.drawBorder("white");
  }

  redraw() {
    super.redraw();
    // console.log(
    //   `     ${this.name}.redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );

    // // Fill the game grid with the grid of cells
    // this.setSize(this.parent?.size || { w: 100, h: 100 });
    // this.cellGrid.setSize(this.size);
    // this.draw();

    // // redraw all the children
    // for (const child of this.children as any) {
    //   if (child?.redraw) child.redraw();
    // }
  }

  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: GameRegion
  ) {
    super(param, parent);
    this.gridDim = gridDim;

    // Create a new cell shape grid
    this.cellGrid = new ShapeGrid(
      GameCell,
      this.gridDim,
      {
        ctx: this.ctx,
        name: "cellGrid",
        loc: { x: 0, y: 0 },
        size: this.size,
        clickable: true,
      },
      this
    );
  }
}
