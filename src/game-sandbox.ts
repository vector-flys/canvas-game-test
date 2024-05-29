/**
 * Game class
 */

"use strict";

import { Canvas, CanvasRenderingContext2D } from "canvas";
import { Events, Sdl } from "@kmamal/sdl";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { ShapeGrid, ShapeGridElement } from "./shapeGrid";

class TestGridElement extends ShapeGridElement {
  draw(): void {
    this.drawText(String(this.num), "white");
  }
  redraw(): void {
    this.draw();
  }
}

export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: Canvas;
  shapeNodes: ShapeNode[] = [];

  /**
   * Handle animations, this runs on setInterval
   *
   * The max number of ticks is Number.MAX_SAFE_INTEGER (9,007,199,254,740,991)
   *   ...or 285,600 years if counting milliseconds
   */
  private ticks: number = 0;
  private seconds: number = 0;
  private animInterval: number = 20; // Interval in milliseconds
  private anim(game: Game, window: Sdl.Video.Window) {
    game.ticks++;

    let dirty: boolean = false;

    // Exit gracefully when the window is closed
    if (window.destroyed) process.exit(0);

    // Do stuff here every interval

    // Add stuff here to be done every second
    if (game.ticks % (1000 / game.animInterval) === 0) {
      game.seconds++;
      // console.log("game.anim(every second)");
    }

    // Add stuff here to be done every 10 seconds
    if (game.ticks % ((1000 * 10) / game.animInterval) === 0) {
      // console.log("game.anim(every ten seconds)");
    }

    // Add stuff here to be done every minute
    if (game.ticks % ((1000 * 60) / game.animInterval) === 0) {
      console.log("game.anim(every minute)");
    }

    // Redraw the window if dirty
    if (dirty) {
      const { pixelWidth: width, pixelHeight: height } = window;
      const buffer = game.canvas.toBuffer("raw");
      window.render(width, height, width * 4, "bgra32", buffer);

      dirty = false;
    }
  }

  mouseHandler(event: Events.Window.Any) {
    // console.log(JSON.stringify(event, null, 2));
    const parentNode = this.shapeNodes[0];

    // Check if any cells were clicked
    if (event.type === "mouseButtonDown") {
      const mouse = event as Events.Window.MouseEvent;
      // console.log("mouse:", JSON.stringify(mouse, null, 2));

      // List the objects that were clicked
      console.log("\n");
      for (const shape of parentNode.childHits({ x: mouse.x, y: mouse.y })) {
        console.log(
          "shape %s clicked",
          shape.name
          //, (shape as TestGridElement).num
        );
      }

      // Loop through all regions and all cells to check for a hit
    } else {
      console.log("game mouseHandler:", event);
    }
  }

  redraw() {
    console.log("game-sandbox.redraw()");

    // Create a gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(1, "lightGreen");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the board
    const gameGrid = this.shapeNodes[0] as ShapeGrid;
    gameGrid.redraw();
  }

  constructor(
    window: Sdl.Video.Window,
    ctx: CanvasRenderingContext2D,
    dim: number = 3
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    // Add a shapeGrid
    this.shapeNodes[0] = new ShapeGrid(
      TestGridElement,
      { w: dim, h: dim },
      {
        ctx: this.ctx,
        name: "shapeGrid",
        loc: { x: 0, y: 0 },
        size: { w: 400, h: 400 },
        clickable: true,
      }
    );

    // Start the animation timer
    setInterval(this.anim, this.animInterval, this, window);
  }
}
