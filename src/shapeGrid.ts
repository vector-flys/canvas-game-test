/**
 * A shape grid is a grid of child shapes
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ObjSize } from "./lib/models";
import { numToCoords, offXY } from "./lib/utils";

/**
 * A grid element
 */
export class ShapeGridElement extends ShapeNode {
  num: number;

  constructor(num: number, param: ShapeNodeParameters, parent?: ShapeNode) {
    super(param, parent);
    this.num = num;
  }
}

/**
 * A grid of shape nodes
 *
 * Constructor
 *   @param ShapeNode parameters
 *   @param dim: dimension of the puzzle (eg: 1, 2, 3)
 */
export class ShapeGrid extends ShapeNode {
  gridDim: ObjSize;
  fillColor: string = "blue";

  // 2-D array of grid elements
  shapeGrid: ShapeGridElement[][] = [];

  // Draw the grid nodes according to parameters
  draw() {
    for (const i of this.shapeGrid) {
      for (const j of i) {
        // draw a filled rectangle
        j.fill(this.fillColor);
        j.drawText(String(j.num), "cyan");
      }
    }
    // Add a border around the grid
    this.drawBorder("red");
  }

  // Redraw the game grid (used when the window is resized)
  redraw() {
    console.log(
      `shapeGrid[${this.name}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );
    // this.fill("white");

    // Redraw the grid elements
    for (const i of this.shapeGrid) {
      for (const j of i) {
        // calculate the size and location of the grid element
        const elementSize = {
          w: this.size.w / this.gridDim.w,
          h: this.size.h / this.gridDim.h,
        };
        j.setSize(elementSize);

        const base = this?.parent?.loc || { x: 0, y: 0 };
        const coords = numToCoords(j.num, this.gridDim);
        const off = offXY(j.num, this.gridDim);
        const cdOff = this.gridDim.w === 1 ? 0 : (this.gridDim.w - 1) / 2; // 1 = 0, 2 = 0.5, 3 = 1, 4 = 1.5
        console.log(
          `${j.num} coords: ${JSON.stringify(coords)}, off: ${JSON.stringify(
            off
          )}, cdOff: ${cdOff}, (${j.size.w}x${j.size.h})`
        );

        const elementLoc = {
          x: base.x + cdOff * j.size.w * off.x,
          y: base.y + cdOff * j.size.h * off.y,
        };
        j.setLoc(elementLoc);
      }
    }
    this.draw();
  }

  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: ShapeNode
  ) {
    super(param, parent);
    // ensure they didn't ask for something stupid
    if (gridDim.w <= 0 && gridDim.h <= 0) {
      throw new Error("Size must be greater than 0");
    }
    this.gridDim = gridDim;

    // Initialize the grid elements
    for (let ci = 0; ci < this.gridDim.w; ci++) {
      for (let ri = 0; ri < this.gridDim.h; ri++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.shapeGrid?.[ci]) this.shapeGrid[ci] = [];
        // If the grid element doesn't exist, create a new one
        if (!this.shapeGrid[ci]?.[ri]) {
          // Calculate position and size of the grid element
          const num = ri * this.gridDim.w + ci + 1;
          this.shapeGrid[ci][ri] = new ShapeGridElement(
            num,
            {
              // Set at 0,0 for now. redraw() will adjust
              loc: { x: 0, y: 0 },
              size: { h: 0, w: 0 },
              name: `grid element [${ci}, ${ri}]`,
              clickable: true,
            },
            this
          );
        }
      }
    }
  }
}
