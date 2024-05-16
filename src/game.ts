/**
 * Game class
 */

"use strict";

import { Canvas, CanvasRenderingContext2D } from "canvas";
import { CircleReturn, Shapes, TextReturn } from "shapes-plus";

interface Coords {
  x: number;
  y: number;
}

interface ObjSize {
  h: number;
  w: number;
}

// A number cell
class numCell {
  loc: Coords;
  size: ObjSize;
  num: number;

  // Draw the cell according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    const width = this.size.w;
    const height = this.size.h;
    const x = this.loc.x - width / 2;
    const y = this.loc.y - height / 2;

    // Draw the cell
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);
    // Add a 2-pixel border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    // Add the number
    ctx.fillStyle = "white";
    ctx.font = `${height - 10}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.num), x + width / 2, y + height / 2);

    // const radius = (width + height) / 2 / 50;
    // this.circle.draw({
    //   x: (width - radius) / 2,
    //   y: (height - radius) / 2,
    //   color: "red",
    //   bColor: "#70cf70",
    //   radius: radius,
    //   drawType: "outline",
    // });
  }

  constructor(num: number, loc: Coords, size: ObjSize) {
    this.loc = loc;
    this.size = size;
    this.num = num;
  }
}

class gameGrid {
  loc: Coords;
  size: ObjSize;
  dim: number;
  grid: numCell[][] = [];
  cellSize: ObjSize;

  // Draw the grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    if (ctx.canvas.width != this.size.w || ctx.canvas.height != this.size.h) {
      this.size = {
        h: ctx.canvas.height,
        w: ctx.canvas.width,
      };

      // The screen size changed, we have to resize the grid
      this.cellSize = {
        h: (this.size.h - 100) / this.dim,
        w: (this.size.w - 100) / this.dim,
      };
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
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

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].draw(ctx);
      }
    }
  }

  // Initialize the grid
  constructor(dim: number, gridSize: Coords) {
    this.dim = dim;
    this.size = {
      h: gridSize.y,
      w: gridSize.x,
    };

    this.cellSize = {
      h: (this.size.h - 100) / dim,
      w: (this.size.w - 100) / dim,
    };

    this.loc = {
      x: 50,
      y: 50,
    };

    for (let i = 0; i < dim; i++) {
      this.grid[i] = [];
      for (let j = 0; j < dim; j++) {
        console.log("Grid:", i, j);
        const cellCenterX =
          this.cellSize.w * i + this.cellSize.w / 2 + this.loc.x;
        const cellCenterY =
          this.cellSize.h * j + this.cellSize.h / 2 + this.loc.y;
        this.grid[i][j] = new numCell(
          j * dim + i + 1,
          { x: cellCenterX, y: cellCenterY },
          { w: this.cellSize.w, h: this.cellSize.h }
        );
      }
    }
  }
}

export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: Canvas;
  shapes: Shapes;
  circle: CircleReturn;
  text: TextReturn;
  grid: gameGrid;

  redraw() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Create a gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "white");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

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
    this.grid = new gameGrid(dim, {
      x: this.canvas.width,
      y: this.canvas.height,
    });

    // Create some shape handlers
    this.shapes = new Shapes(ctx); // ctx object has the canvas property
    this.circle = this.shapes.createCircle();
    this.text = this.shapes.createText();
  }
}
