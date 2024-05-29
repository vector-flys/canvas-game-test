/**
 * A cell grid, which is useful for displaying possibilities
 */

"use strict";

import { ObjSize, CellShapes } from "./lib/models";
import { ShapeNodeParameters } from "./shapeNode";

import { NumCell } from "./numCell";
import { RegionGrid } from "./gameRegion";
import { ShapeGrid, ShapeGridElement } from "./shapeGrid";
import { numToCoords } from "./lib/utils";

/**
 * A game cell
 */
export class GameCell extends ShapeGridElement {
  draw() {
    this.fill("black");
  }
  redraw(): void {
    this.draw();
  }
}

/**
 * Grid for possibilites within a cell
 *
 * Constructor
 *   @param gameGrid (the gameGrid on which to draw)
 *   @param loc (the location within the gameGrid)
 */
export class CellGRid extends ShapeGrid {
  regionGrid: RegionGrid; // Pointer to the parent region grid
  value: number | undefined = undefined; // The value of the cell

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
        const numCell = this.shapeGrid[cellXY.x][cellXY.y] as NumCell;
        numCell.showPoss = possible;
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
        const numCell = this.shapeGrid[cellXY.x][cellXY.y] as NumCell;
        numCell.cellShape = shape;
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
        const numCell = this.shapeGrid[cellXY.x][cellXY.y] as NumCell;
        numCell.numColor = color;
      }
    }
  }

  // Draw the possibility grid according to parameters
  draw() {
    // Draw the cell background
    this.fill("gray");

    // console.log("gameCell.draw()", this.value);
    if (this.value) {
      this.drawText(String(this.value), "white");
    } else {
      // Draw the possibilites
      for (let i = 0; i < this.shapeGrid.length; i++) {
        for (let j = 0; j < this.shapeGrid[i].length; j++) {
          this.shapeGrid[i][j].draw();
        }
      }
    }

    // Add a border around the cell
    this.drawBorder("gray");
  }

  redraw() {
    this.draw();
  }

  constructor(
    gridDim: ObjSize,
    param: ShapeNodeParameters,
    parent?: RegionGrid
  ) {
    // Initialize the possibility grid
    super(NumCell, gridDim, param, parent);
    this.regionGrid = this.parent as RegionGrid;

    this.gridDim = parent?.gridDim || { w: 100, h: 100 };
  }
}
