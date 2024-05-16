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

import { Coords, ObjSize, CellShapes } from "./lib/models";
import { ShapeNode } from "./shapeNode";
import { Events } from "@kmamal/sdl";

// A number cell
class NumCell extends ShapeNode {
  num: number;

  cellShape: CellShapes = CellShapes.none;

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

  constructor(
    num: number,
    loc: Coords,
    size: ObjSize,
    parent: ShapeNode | undefined = undefined
  ) {
    super(loc, size, parent);
    this.num = num;
  }
}

/**
 * Grid for possibilites within a cell
 *
 * Constructor
 *   @param gameGrid (the gameGrid on which to draw)
 *   @param loc (the location within the gameGrid)
 */
class CellGrid extends ShapeNode {
  base: Coords = { x: 0, y: 0 }; // The base location of the gameGrid
  dim: number; // Dimension of possibilites matrix (eg 3 = 3x3)
  cellSize: ObjSize = { w: 0, h: 0 };

  grid: NumCell[][] = [];

  // Draw the cell grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    // The screen size may changed, we have to resize the grid
    this.size = this?.parent?.size || {
      h: ctx.canvas.height,
      w: ctx.canvas.width,
    };
    this.cellSize = {
      h: this.size.h / this.dim,
      w: this.size.w / this.dim,
    };
    this.base = this.parent?.loc || { x: 0, y: 0 };

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

          // Pick a rotating shape for the cell
          this.grid[i][j].cellShape =
            this.grid[i][j].num % (Object.keys(CellShapes).length / 2);
          // console.log(
          //   "Cell %s, shape =",
          //   this.grid[i][j].num,
          //   CellShapes[this.grid[i][j].cellShape]
          // );
        }

        // Set the properties of the cell
        const cellCenterX =
          this.cellSize.w * i + this.cellSize.w / 2 + this.base.x + this.loc.x;
        const cellCenterY =
          this.cellSize.h * j + this.cellSize.h / 2 + this.base.y + this.loc.y;
        this.grid[i][j].loc = { x: cellCenterX, y: cellCenterY };
        this.grid[i][j].size = {
          h: this.cellSize.h,
          w: this.cellSize.w,
        };
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
  constructor(loc: Coords, size: ObjSize, parent: GameGrid) {
    super(loc, size, parent);

    this.dim = parent?.dim;
  }
}

// Class for the game grid iteself
class GameGrid extends ShapeNode {
  dim: number;

  // For now, just a single cell
  cellGrid: CellGrid;

  // Draw the game grid according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    this.cellGrid.draw(ctx);
  }

  redraw(ctx: CanvasRenderingContext2D) {
    const pctSize = 0.75;
    const boardSize: ObjSize = {
      w: Math.floor(ctx.canvas.width * pctSize),
      h: Math.floor(ctx.canvas.height * pctSize),
    };
    this.loc = {
      x: (ctx.canvas.width - boardSize.w) / 2,
      y: (ctx.canvas.height - boardSize.h) / 2,
    };
    this.size = boardSize;
    this.draw(ctx);
  }

  constructor(dim: number, loc: Coords, size: ObjSize) {
    super(loc, size);
    this.dim = dim;

    // For now, just pass through a cell grid so we can work on it
    this.cellGrid = new CellGrid(this.loc, this.size, this);
  }
}

export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: Canvas;

  gameGrid: GameGrid;

  mouseHandler(event: Events.Window.Any) {
    console.log(JSON.stringify(event, null, 2));

    // Check if any cells were clicked
    if (event.type === "mouseButtonDown") {
      const mouse = event as Events.Window.MouseEvent;
      console.log("mouse:", mouse);

      // Loop through cellGrid to check for a hit
      for (const i of this.gameGrid.cellGrid.grid) {
        for (const j of i) {
          if (j.bounds({ x: mouse.x, y: mouse.y })) {
            console.log("click:", j.num);
          }
        }
      }
    } else {
      console.log("game mouseHandler:", event);
    }
    // console.log("Process for grid", this.gameGrid.cellGrid.grid);
  }

  redraw() {
    // Create a gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "lightBlue");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the game grid
    this.gameGrid.redraw(this.ctx);
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
    this.gameGrid = new GameGrid(
      dim,
      { x: 0, y: 0 },
      { w: this.canvas.width, h: this.canvas.height }
    );
  }
}
