/**
 * Game class
 */

"use strict";

import { Canvas, CanvasRenderingContext2D } from "canvas";
import {
  CircleReturn,
  RectReturn,
  Shapes,
  TextReturn,
  TriangleReturn,
} from "shapes-plus";

interface Coords {
  x: number;
  y: number;
}

interface ObjSize {
  h: number;
  w: number;
}

enum CellShapes {
  rectangle,
  triangle,
  circle,
}

// A number cell
class NumCell {
  loc: Coords;
  size: ObjSize;
  num: number;

  cellShape: CellShapes = CellShapes.rectangle;

  // Draw the cell according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    const width = this.size.w;
    const height = this.size.h;
    const x = this.loc.x - width / 2;
    const y = this.loc.y - height / 2;

    // Create a shapes handler
    const shapes = new Shapes(ctx); // ctx object has the canvas property
    // this.text = this.shapes.createText();

    // Draw the cell shape
    if (this.cellShape == CellShapes.rectangle) {
      const rectangle = shapes.createRect();
      rectangle.draw({
        x: x,
        y: y,
        width: width,
        height: height,
        color: "black",
        // bColor: "#70cf70",
      });
    } else if (this.cellShape == CellShapes.triangle) {
      const triangle = shapes.createTriangle();
      triangle.draw({
        x: x + width / 2,
        y: y + height - height * 0.025,
        size: height * 0.95,
        color: "black",
        // bColor: "#70cf70",
      });
    } else if (this.cellShape == CellShapes.circle) {
      const circle = shapes.createCircle();
      const radius = (width + height) / 5;
      circle.draw({
        x: x + width / 2,
        y: y + height / 2,
        color: "red",
        bColor: "#70cf70",
        radius: radius,
        drawType: "outline",
      });
    }

    // Add a 2-pixel border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Add the number
    ctx.fillStyle = "white";
    ctx.font = `${height * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.num), x + width / 2, y + height / 2);
  }

  constructor(num: number, loc: Coords, size: ObjSize) {
    this.loc = loc;
    this.size = size;
    this.num = num;
  }
}

// Grid for possibilties within a cell
class CellGrid {
  loc: Coords;
  dim: number;
  size: ObjSize = { w: 0, h: 0 };
  cellSize: ObjSize = { w: 0, h: 0 };

  grid: NumCell[][] = [];

  // Draw the cell grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    if (ctx.canvas.width != this.size.w || ctx.canvas.height != this.size.h) {
      // The screen size changed, we have to resize the grid
      this.size = {
        h: ctx.canvas.height,
        w: ctx.canvas.width,
      };
      this.cellSize = {
        h: (this.size.h - 100) / this.dim,
        w: (this.size.w - 100) / this.dim,
      };

      // Initialize the grid
      for (let i = 0; i < this.dim; i++) {
        for (let j = 0; j < this.dim; j++) {
          // If the grid column doesn't exist, create an empty column
          if (!this.grid?.[i]) this.grid[i] = [];

          // If the grid cell doesn't exist, create a new cell
          if (!this.grid[i]?.[j]) {
            this.grid[i][j] = new NumCell(
              j * this.dim + i + 1,
              { x: 0, y: 0 },
              { h: 0, w: 0 }
            );
            // Pick a random shape for the cell
            this.grid[i][j].cellShape = Math.floor(
              Math.random() * Object.keys(CellShapes).length
            );
          }

          // Set the properties of the cell
          const cellCenterX =
            this.cellSize.w * i + this.cellSize.w / 2 + this.loc.x;
          const cellCenterY =
            this.cellSize.h * j + this.cellSize.h / 2 + this.loc.y;
          this.grid[i][j].loc = { x: cellCenterX, y: cellCenterY };
          this.grid[i][j].size = {
            h: this.cellSize.h,
            w: this.cellSize.w,
          };
        }
      }
    }

    // Now draw the possibilites
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].draw(ctx);
      }
    }
  }

  // Initialize the cell grid
  constructor(gameGrid: GameGrid) {
    this.dim = gameGrid.dim;
    this.loc = gameGrid.loc;
  }
}

// Class for the game grid iteself
class GameGrid {
  loc: Coords;
  size: ObjSize;
  gridSize: ObjSize;
  dim: number;

  // For now, just a single cell
  grid: CellGrid;

  // Draw the game grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    this.grid.draw(ctx);
  }

  constructor(dim: number, gridSize: Coords) {
    this.dim = dim;
    this.size = {
      h: gridSize.y,
      w: gridSize.x,
    };

    this.gridSize = {
      h: this.size.h - 100,
      w: this.size.w - 100,
    };

    this.loc = {
      x: 50,
      y: 50,
    };

    // For now, just pass through a cell grid so we can work on it
    this.grid = new CellGrid(this);
  }
}

export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: Canvas;

  grid: GameGrid;

  redraw() {
    // Create a gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "lightBlue");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the grid
    this.grid.draw(this.ctx);
  }

  constructor(ctx: CanvasRenderingContext2D, size: number = 9) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    // ensure that the size is a perfect square
    const dim = Math.sqrt(size);
    if (size !== dim * dim) {
      throw new Error("Size must be a perfect square");
    }

    // Create a new game grid
    this.grid = new GameGrid(dim, {
      x: this.canvas.width,
      y: this.canvas.height,
    });
  }
}
