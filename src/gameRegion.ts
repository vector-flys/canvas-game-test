/**
 * A game region
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ShapeGrid, ShapeGridElement } from "./shapeGrid";
import { ObjSize } from "./lib/models";
import { GameGrid } from "./gameGrid";
import { CellGrid, GameCell } from "./gameCell";

/**
 * A game region
 */
export class GameRegion extends ShapeGridElement {
  cellGrid: CellGrid;
  gridDim: ObjSize;

  draw() {
    console.log(
      `    region[${this.name}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );
    this.drawBorder("white");
  }
  redraw(): void {
    super.redraw();
    // console.log(
    //   `    region[${this.name}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );
    // this.draw();

    // // // redraw all the children
    // for (const child of this.children as any) {
    //   if (child?.redraw) child.redraw();
    // }
  }

  constructor(num: number, param: ShapeNodeParameters, parent?: ShapeNode) {
    super(num, param, parent);
    this.gridDim = (this?.parent as RegionGrid).gridDim;
    // Create a new cell shape grid
    this.cellGrid = new CellGrid(
      this.gridDim,
      {
        ctx: this.ctx,
        name: "cellGridParent",
        loc: { x: 0, y: 0 },
        size: this.size,
        clickable: true,
      },
      this
    );
  }
}

/**
 * A region for the game board (dim x dim)
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: number of cells in each direction
 */
export class RegionGrid extends ShapeNode {
  regionGrid: ShapeGrid;
  gridDim: ObjSize;
  // gameGrid: GameGrid; // Pointer to the parent game grid
  value: number | undefined = undefined; // for debugging purposes

  // Draw the region cells according to parameters
  draw() {
    console.log(
      `    ${this.name}.draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`,
      "- parent:",
      this.parent?.name,
      ", children [",
      this.children.map((c) => c.name).join(", "),
      "]"
    );
    // this.drawText(String(this.value), "white");
    // Add a border around the region grid
    // this.drawBorder("white");
  }

  redraw() {
    console.log(
      `  ${this.name}.redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );

    // Fill the game grid with the grid of regions
    this.setSize(this.parent?.size || { w: 100, h: 100 });
    this.regionGrid.setSize(this.size);
    this.draw();

    // redraw all the children
    for (const child of this.children as any) {
      if (child?.redraw) child.redraw();
    }
  }

  constructor(gridDim: ObjSize, param: ShapeNodeParameters, parent?: GameGrid) {
    super(param, parent);
    this.gridDim = gridDim;

    // Create a new region shape grid
    this.regionGrid = new ShapeGrid(
      GameRegion,
      this.gridDim,
      {
        ctx: this.ctx,
        name: "regionGrid",
        loc: { x: 0, y: 0 },
        size: this.size,
        clickable: true,
      },
      this
    );
  }
}
