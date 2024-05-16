/**
 * Game class
 */

"use strict";

import { Canvas, CanvasRenderingContext2D } from "canvas";
import { Events } from "@kmamal/sdl";
import { GameGrid } from "./gameGrid";

export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: Canvas;
  gridSize: number;

  gameGrid: GameGrid;

  mouseHandler(event: Events.Window.Any) {
    // console.log(JSON.stringify(event, null, 2));

    // Check if any cells were clicked
    if (event.type === "mouseButtonDown") {
      const mouse = event as Events.Window.MouseEvent;
      // console.log("mouse:", mouse);

      // Loop through cellGrid to check for a hit
      for (const i of this.gameGrid.cellGrid.grid) {
        for (const j of i) {
          if (j.bounds({ x: mouse.x, y: mouse.y })) {
            console.log(`Button ${j.num} clicked`);
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
    this.gridSize = size;

    // Create a new game grid
    this.gameGrid = new GameGrid(
      size,
      { x: 0, y: 0 },
      { w: this.canvas.width, h: this.canvas.height }
    );
  }
}
