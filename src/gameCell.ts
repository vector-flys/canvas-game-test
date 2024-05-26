/**
 * A cell grid, which is useful for displaying possibilities
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { Coords, ObjSize, CellShapes } from "./lib/models";
import { ShapeNode } from "./shapeNode";

import { NumCell } from "./numCell";
import { GameRegion } from "./gameRegion";
import { Shapes } from "shapes-plus";
import { coordsToNum, numToCoords } from "./lib/utils";

/**
 * Grid for possibilites within a cell
 *
 * Constructor
 *   @param gameGrid (the gameGrid on which to draw)
 *   @param loc (the location within the gameGrid)
 */
export class GameCell extends ShapeNode {
  dim: number; // Dimension of possibilites matrix (eg 3 = 3x3)
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
    const size = this.dim * this.dim;
    return Array.from(Array(size), (_: number, i: number) => i + 1);
  }

  // Set the possibilities
  setPossible(possible: boolean = true, match: number[] = []) {
    const toSet = match.length > 0 ? match : this.allPossibilities();
    for (const poss of toSet) {
      if (toSet.includes(poss)) {
        const cellXY = numToCoords(poss - 1, this.dim * this.dim);
        this.grid[cellXY.x][cellXY.y].showPoss = possible;
      }
    }
  }

  // Set the possibility shapes
  setPossibleShape(shape: CellShapes = CellShapes.none, match: number[] = []) {
    const toSet = match.length > 0 ? match : this.allPossibilities();
    for (const poss of toSet) {
      if (toSet.includes(poss)) {
        const cellXY = numToCoords(poss - 1, this.dim * this.dim);
        this.grid[cellXY.x][cellXY.y].cellShape = shape;
      }
    }
  }

  // Set the possibility shapes
  setPossibleNumColor(color: string = "gray", match: number[] = []) {
    const toSet = match.length > 0 ? match : this.allPossibilities();
    for (const poss of toSet) {
      if (toSet.includes(poss)) {
        const cellXY = numToCoords(poss - 1, this.dim * this.dim);
        this.grid[cellXY.x][cellXY.y].numColor = color;
      }
    }
  }

  // Draw the possibility grid according to parameters
  draw(ctx: CanvasRenderingContext2D) {
    // const width = this.size.w;
    // const height = this.size.h;
    // const x = this.loc.x - width / 2;
    // const y = this.loc.y - height / 2;

    // Draw the cell background
    const shapes = new Shapes(ctx); // ctx object has the canvas property
    const rectangle = shapes.createRect();
    rectangle.draw({
      x: this.loc.x,
      y: this.loc.y,
      width: this.size.w,
      height: this.size.h,
      color: "gray",
    });

    // console.log("gameCell.draw()", this.value);
    if (this.value) {
      // Draw the value instead of possibilities
      ctx.fillStyle = "white";
      ctx.font = `${this.size.h * 0.6}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        String(this.value),
        this.loc.x + this.size.w / 2,
        this.loc.y + this.size.h / 2
      );
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
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.loc.x, this.loc.y, this.size.w, this.size.h);
  }

  redraw(ctx: CanvasRenderingContext2D) {
    this.loc = this?.parent?.loc || { x: 0, y: 0 };
    this.size = this?.parent?.size || {
      w: ctx.canvas.width,
      h: ctx.canvas.height,
    };
    this.size = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    this.possibilitySize = {
      w: this.size.w / this.dim,
      h: this.size.h / this.dim,
    };
    // adjust location for cell number
    this.loc = {
      x: this.loc.x + this.size.w * ((this.num - 1) % this.dim),
      y: this.loc.y + this.size.h * Math.floor((this.num - 1) / this.dim),
    };
    // console.log(
    //   `cellGrid[${this.num}].redraw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );

    this.draw(ctx);
  }

  // Initialize the cell grid
  constructor(num: number, loc: Coords, size: ObjSize, parent: GameRegion) {
    super(loc, size, parent);

    this.dim = parent?.dim;
    this.num = num;
    // Initialize the grid
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        // If the grid column doesn't exist, create an empty column
        if (!this.grid?.[i]) this.grid[i] = [];

        // If the num cell doesn't exist, create a new cell
        if (!this.grid[i]?.[j]) {
          this.grid[i][j] = new NumCell(
            j * this.dim + i + 1,
            { x: 0, y: 0 },
            { h: 0, w: 0 },
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
