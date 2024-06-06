/**
 * A game grid
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ObjSize } from "./lib/models";
import { RegionGrid } from "./gameRegion";

/**
 * Grid for the game board
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: dimension of the puzzle (eg: 1, 2, 3)
 */
export class GameGrid extends ShapeNode {
  regionGrid: RegionGrid;
  gridDim: ObjSize;

  draw() {
    console.log(
      `   ${this.name}.draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`,
      "- parent:",
      this.parent?.name,
      ", children [",
      this.children.map((c) => c.name).join(", "),
      "]"
    );
    this.fill("green");
  }

  redraw() {
    super.redraw();
    // console.log(
    //   ` ${this.name}.redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );
    // this.draw();

    // // now redraw all the children
    // for (const child of this.children as any) {
    //   if (child?.redraw) child.redraw();
    // }
  }

  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: ShapeNode
  ) {
    super(param, parent);
    this.gridDim = gridDim;

    // this.gameRegions = this.shapeGrid as GameRegion[][];
    // ensure they didn't ask for something stupid
    if (gridDim.w <= 0 || gridDim.h <= 0) {
      throw new Error("Grid dimensions must be greater than 0");
    }
    // Create a new region grid
    this.regionGrid = new RegionGrid(
      this.gridDim,
      {
        ctx: this.ctx,
        name: "regionGridParent",
        loc: { x: 0, y: 0 },
        size: this.size,
        clickable: true,
      },
      this
    );
  }
}
