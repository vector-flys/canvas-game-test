/**
 * A game region
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "../shapeNode";
import { ShapeGridElement } from "../shapeGrid";
import { ObjSize } from "../lib/models";
import { GameGrid } from "./gameGrid";

/**
 * A game region
 */
export class GameRegion extends ShapeGridElement {
  // cellGrid: CellGrid;
  gridDim: ObjSize;

  // // Override draw for this region
  // draw() {
  //   if (!this.visible) return;
  //   const spaces = " ".repeat(this.shapeDepth() * 2);
  //   console.log(
  //     `${spaces}   region[${this.name}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
  //   );
  //   this.drawBorder("#1010ff");
  // }
  // redraw(): void {
  //   super.redraw();
  // }

  constructor(num: number, param: ShapeNodeParameters, parent?: ShapeNode) {
    super(num, param, parent);
    this.gridDim = (this?.parent as GameGrid).gridDim;
    this.name = `region${num}`;
  }
}
