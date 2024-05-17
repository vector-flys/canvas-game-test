/**
 * Game class
 */

"use strict";

import { Canvas, CanvasRenderingContext2D } from "canvas";
import { Events } from "@kmamal/sdl";
import { GameGrid } from "./gameGrid";
import { GameRegion } from "./gameRegion";
import { CellGrid } from "./cellGrid";

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

      // Loop through objects to check for a hit
      for (const gr of this.gameGrid.gameRegion) {
        for (const grj of gr) {
          for (const cg of grj.cellGrid) {
            for (const cgj of cg) {
              for (const ng of cgj.grid) {
                for (const ngj of ng) {
                  if (ngj.bounds({ x: mouse.x, y: mouse.y })) {
                    const gameCell = ngj?.parent as CellGrid;
                    const gameRegion = gameCell?.parent as GameRegion;
                    console.log(`Region: ${gameRegion?.num}`);
                    console.log(`  Cell: ${gameCell?.num}`);
                    console.log(`  Poss: ${ngj.num} clicked`);
                  }
                }
              }
            }
          }
        }
      }
    } else {
      console.log("game mouseHandler:", event);
    }
    // console.log("Process for grid", this.gameGrid.cellGrid.grid);
  }

  redraw() {
    console.log("game.redraw()");

    // Create a gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "lightBlue");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the game grid
    this.gameGrid.redraw(this.ctx);
    // this.gameGrid.draw(this.ctx);
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
