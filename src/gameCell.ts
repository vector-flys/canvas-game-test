/**
 * A cell grid, which is useful for displaying possibilities
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize, CellShapes } from "./lib/models";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";

import { NumCell } from "./numCell";
import { GameRegion } from "./gameRegion";
import { Shapes } from "shapes-plus";
import { coordsToNum, numToCoords, offXY } from "./lib/utils";

/**
 * Grid for possibilites within a cell
 *
 * Constructor
 *   @param gameGrid (the gameGrid on which to draw)
 *   @param loc (the location within the gameGrid)
 */
export class GameCell extends ShapeNode {
  gridDim: ObjSize; // Dimension of grid (eg 9 = 3x3)
  num: number;
  value: number | undefined = undefined;

  possibilitySize: ObjSize = { w: 0, h: 0 };

  // 2-D array of num cells
  grid: NumCell[][] = [];

  // Set the value of a cell
  setValue(value: number | undefined) {
    if (!value || value === 0) {
      this.value = undefined;
    } else {
      this.value = value;
    }
  }

  // Return an array of all possible values, starting with 1
  allPossibilities() {
    const size = this.gridDim.w * this.gridDim.h;
    return Array.from(Array(size), (_: number, i: number) => i + 1);
  }

  // Set the possibilities
  setPossible(possible: boolean = true, match: number[] = []) {
    const toSet = match.length > 0 ? match : this.allPossibilities();
    for (const poss of toSet) {
      if (toSet.includes(poss)) {
        const cellXY = numToCoords(poss - 1, {
          w: this.gridDim.w,
          h: this.gridDim.h,
        });
        this.grid[cellXY.x][cellXY.y].showPoss = possible;
      }
    }
  }

  // Set the possibility shapes
  setPossibleShape(shape: CellShapes = CellShapes.none, match: number[] = []) {
    const toSet = match.length > 0 ? match : this.allPossibilities();
    for (const poss of toSet) {
      if (toSet.includes(poss)) {
        const cellXY = numToCoords(poss - 1, {
          w: this.gridDim.w,
          h: this.gridDim.h,
        });
        this.grid[cellXY.x][cellXY.y].cellShape = shape;
      }
    }
  }

  // Set the possibility shapes
  setPossibleNumColor(color: string = "gray", match: number[] = []) {
    const toSet = match.length > 0 ? match : this.allPossibilities();
    for (const poss of toSet) {
      if (toSet.includes(poss)) {
        const cellXY = numToCoords(poss - 1, {
          w: this.gridDim.w,
          h: this.gridDim.h,
        });
        this.grid[cellXY.x][cellXY.y].numColor = color;
      }
    }
  }

  // Draw the possibility grid according to parameters
  draw(ctx: CanvasRenderingContext2D) {
    // Draw the cell background
    this.fill("gray");

    // console.log("gameCell.draw()", this.value);
    if (this.value) {
      this.drawText(String(this.value), "white");
    } else {
      // Draw the possibilites
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          // Set the properties of the numCell
          const cellCenterX =
            this.possibilitySize.w * i +
            this.possibilitySize.w / 2 +
            this.base.x +
            this.loc.x;
          const cellCenterY =
            this.possibilitySize.h * j +
            this.possibilitySize.h / 2 +
            this.base.y +
            this.loc.y;
          this.grid[i][j].loc = { x: cellCenterX, y: cellCenterY };
          this.grid[i][j].size = {
            h: this.possibilitySize.h,
            w: this.possibilitySize.w,
          };

          this.grid[i][j].draw(ctx);
        }
      }
    }

    // Add a border around the cell
    this.drawBorder("gray");
  }

  redraw(ctx: CanvasRenderingContext2D) {
    this.loc = this?.parent?.loc || { x: 0, y: 0 };
    this.size = this?.parent?.size || {
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };
    this.setSize({
      w: this.size.w / this.gridDim.w,
      h: this.size.h / this.gridDim.h,
    });
    this.possibilitySize = {
      w: this.size.w / this.gridDim.w,
      h: this.size.h / this.gridDim.h,
    };
    // adjust location for cell number
    const base = this?.parent?.loc || { x: 0, y: 0 };
    const cdOff = this.gridDim.w === 1 ? 0 : (this.gridDim.w - 1) / 2; // 1 = 0, 2 = 0.5, 3 = 1, 4 = 1.5
    const off = offXY(this.num, this.gridDim);
    this.setLoc({
      // x: base.x + this.size.w * ((this.num - 1) % this.dim) - xB,
      x: base.x + cdOff * this.size.w * off.x,
      y: base.y + cdOff * this.size.h * off.y,
    });
    // console.log(
    //   `cellGrid[${this.num}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );

    this.draw(ctx);
  }

  // Initialize the cell grid
  constructor(num: number, param: ShapeNodeParameters, parent: GameRegion) {
    super(param, parent);

    this.gridDim = parent?.gridDim || { w: 100, h: 100 };
    this.num = num;
    // Initialize the grid
    for (let i = 0; i < this.gridDim.w; i++) {
      for (let j = 0; j < this.gridDim.h; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.grid?.[i]) this.grid[i] = [];

        // If the num cell doesn't exist, create a new cell
        if (!this.grid[i]?.[j]) {
          const num = j * this.gridDim.w + i + 1;
          this.grid[i][j] = new NumCell(
            num,
            { loc: { x: 0, y: 0 }, size: { h: 0, w: 0 }, name: `Poss ${num}` },
            this
          );

          // // Pick a rotating shape for the cell
          this.grid[i][j].cellShape = num;
          //   this.grid[i][j].num % (Object.keys(CellShapes).length / 2);
          // this.grid[i][j].cellShape = CellShapes.rectangle;
        }
      }
    }
  }
}
