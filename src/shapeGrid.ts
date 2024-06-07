/**
 * A shape grid is a grid of child shapes
 */

"use strict";

import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ObjSize } from "./lib/models";
import { numToCoords, offXY } from "./lib/utils";

/**
 * A shape grid element
 */
export abstract class ShapeGridElement extends ShapeNode {
  num: number;

  constructor(num: number, param: ShapeNodeParameters, parent?: ShapeNode) {
    super(param, parent);
    this.num = num;
  }

  // abstract draw(): void;
  // draw(): void { throw new Error("draw() not implemented."); }
  // abstract redraw(): void;
  // redraw(): void { throw new Error("redraw() not implemented."); }
}

/**
 * Function to create an array of ShapeGridElements
 * @param classConstructor the class constructor for the element
 * @param gridDim the dimensions of the grid
 * @param param the parameters for the element
 * @param parent the parent of the element
 *
 * @returns a 2-D array of ShapeGridElements
 */
function createShapeGridElements<ShapeGridElement>(
  classConstructor: {
    new (
      num: number,
      param: ShapeNodeParameters,
      parent?: ShapeNode
    ): ShapeGridElement;
  },
  gridDim: ObjSize,
  param: ShapeNodeParameters,
  parent?: ShapeNode
): ShapeGridElement[][] {
  const instances: ShapeGridElement[][] = [];
  const baseName = param?.name || "shapeGridElement";

  for (let ci = 0; ci < gridDim.w; ci++) {
    for (let ri = 0; ri < gridDim.h; ri++) {
      // If the grid column doesn't exist, create an empty column
      if (!instances?.[ci]) instances[ci] = [];
      // If the grid element doesn't exist, create a new one
      if (!instances[ci]?.[ri]) {
        const num = ri * gridDim.w + ci + 1;
        param.name = `${baseName} element ${num}`;
        instances[ci][ri] = new classConstructor(
          num,
          {
            ctx: param.ctx,
            loc: { x: 0, y: 0 },
            size: { w: param.size.w / gridDim.w, h: param.size.h / gridDim.h },
            clickable: param.clickable,
          },
          parent
        );
      }
    }
  }
  return instances;
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
  fillColor: string = "yellow";

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

  // Redraw the grid (used when the window is resized)
  redraw() {
    // We do not need to call super.redraw() because we are special...
    console.log(
      `shapeGrid[${this.name}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );
    this.base = this.topLeft();

    // If we have a draw function, then call it
    if ((this as any)?.draw) (this as any).draw();

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
          `  ${j.num} coords: ${JSON.stringify(coords)}, off: ${JSON.stringify(
            off
          )}, cdOff: ${cdOff}, (${Math.floor(j.size.w)}x${Math.floor(
            j.size.h
          )}), parent: ${JSON.stringify(this?.parent?.parent?.loc)}
          }`
        );

        const elementLoc = {
          x: base.x + cdOff * j.size.w * off.x,
          y: base.y + cdOff * j.size.h * off.y,
        };
        j.setLoc(elementLoc);
        // if ((j as any)?.draw) (j as any).draw();

        // // If there are any children, then redraw them as well
        // for (const child of j.children as any) {
        //   if (child?.redraw) child.redraw();
        // }
      }
    }
    this.draw();

    // Redraw any children of this object
    for (const child of this.children as any) {
      // console.log(`    -- redrawing child ${child.name}`);
      if (child?.redraw) child.redraw();
    }
  }

  constructor(
    // class constructor for the grid elements
    shapeClass: new (
      num: number,
      param: ShapeNodeParameters,
      parent?: ShapeNode
    ) => ShapeGridElement,
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
    this.shapeGrid = createShapeGridElements(shapeClass, gridDim, param, this);
  }
}
