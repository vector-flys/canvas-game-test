/**
 * Game class
 */

"use strict";

import { Canvas, CanvasRenderingContext2D } from "canvas";
import { Events, Sdl } from "@kmamal/sdl";
import { GameGrid } from "./gameGrid";
import { GameRegion } from "./gameRegion";
import { GameCell } from "./gameCell";
import { numToCoords, objEqual } from "./lib/utils";
import { CellShapes } from "./lib/models";

export class Game {
  ctx: CanvasRenderingContext2D;
  canvas: Canvas;
  gridSize: number; // Number of regions / cells / possibilities (eg: 4, 9 ...)
  gameSize: number; // Number of region cells (eg 16, 81 ...)

  gameGrid: GameGrid;

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
    let newValue: boolean = false;

    // Exit gracefully when the window is closed
    if (window.destroyed) process.exit(0);

    // Do stuff here every interval

    // Add stuff here to be done every second
    if (game.ticks % (1000 / game.animInterval) === 0) {
      game.seconds++;
      // console.log("Every Second...");

      // One full round
      if (game.seconds <= game.gameSize + game.gridSize) {
        const matrix = numToCoords(game.seconds - 1, game.gameSize);
        const startReg = numToCoords(matrix.y, game.gridSize);
        const startCel = numToCoords(matrix.x, game.gridSize);
        const newCell =
          game.gameGrid.gameRegion[startReg.x][startReg.y].gameCell[startCel.x][
            startCel.y
          ];

        // Iterate through all regions and all cells
        for (let regnum = 0; regnum < game.gridSize; regnum++) {
          const regXY = numToCoords(regnum, game.gridSize);
          // console.log(`  Set region ${regnum}:`, JSON.stringify(regXY));
          const region = game.gameGrid.gameRegion[regXY.x][regXY.y];

          for (let celnum = 0; celnum < game.gridSize; celnum++) {
            const celXY = numToCoords(celnum, game.gridSize);
            // console.log(`    Set cell ${celnum}:`, JSON.stringify(celXY));
            const cell = region.gameCell[celXY.x][celXY.y];

            // Increment the value of the cell if it is set
            dirty = true;
            if (cell?.value) {
              cell.setValue(cell.value + 1);
              if (cell.value > game.gridSize) {
                cell.setValue(0);
                for (let poss = 0; poss < game.gridSize; poss++) {
                  const pXY = numToCoords(poss, game.gridSize);
                  cell.grid[pXY.x][pXY.y].cellShape = CellShapes.none;
                  cell.setPossible(false);
                  cell.setPossible(true, [2, 3]);
                  cell.setPossibleShape(CellShapes.circle, [2]);
                  cell.setPossibleNumColor("white", [2]);
                  cell.setPossibleNumColor("yellow", [3]);
                }
              }
            } else if (cell === newCell && game.seconds <= game.gameSize) {
              cell.setValue(1);
            }
            cell.draw(game.ctx);
          }
        }
      }

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

    // Check if any cells were clicked
    if (event.type === "mouseButtonDown") {
      const mouse = event as Events.Window.MouseEvent;
      // console.log("mouse:", mouse);

      // Loop through all regions and all cells to check for a hit
      console.log("Mouse: checking %s cells", this.gameSize);
      for (let cellNum = 0; cellNum < this.gameSize; cellNum++) {
        const { y: region, x: cell } = numToCoords(cellNum, this.gameSize);
        // console.log("  - Checking region %s, cell %s", region, cell);
        const regXY = numToCoords(region, this.gridSize);
        const cellXY = numToCoords(cell, this.gridSize);
        const checkCell =
          this.gameGrid.gameRegion[regXY.x][regXY.y].gameCell[cellXY.x][
            cellXY.y
          ];

        // Check if the cell was clicked - shapeNode.bounds seems to be broken here
        //   it looks like an issue with relative vs. absolute loc in the shapeNode
        if (checkCell.bounds({ x: mouse.x, y: mouse.y })) {
          console.log(
            `Region: ${(checkCell?.parent as GameRegion).num}`,
            JSON.stringify(regXY)
          );
          console.log(
            `  Cell: ${checkCell.num} clicked`,
            JSON.stringify(cellXY)
          );
        }

        // Check each possibility bounds
        for (const ng of checkCell.grid) {
          for (const ngj of ng) {
            if (ngj.bounds({ x: mouse.x, y: mouse.y })) {
              const gameCell = ngj?.parent as GameCell;
              const gameRegion = gameCell?.parent as GameRegion;
              console.log(`  Region: ${gameRegion?.num} (${region})`);
              console.log(`    Cell: ${gameCell?.num} (${cell})`);
              console.log(`    Poss: ${ngj.num} clicked`);
            }
          }
        }
      }

      // // Loop through all possibilities to check for a hit
      // for (const gr of this.gameGrid.gameRegion) {
      //   for (const grj of gr) {
      //     for (const cg of grj.gameCell) {
      //       for (const cgj of cg) {
      //         for (const ng of cgj.grid) {
      //           for (const ngj of ng) {
      //             if (ngj.bounds({ x: mouse.x, y: mouse.y })) {
      //               const gameCell = ngj?.parent as GameCell;
      //               const gameRegion = gameCell?.parent as GameRegion;
      //               console.log(`Region: ${gameRegion?.num}`);
      //               console.log(`  Cell: ${gameCell?.num}`);
      //               console.log(`  Poss: ${ngj.num} clicked`);
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
    } else {
      console.log("game mouseHandler:", event);
    }
    // console.log("Process for grid", this.gameGrid.gameCell.grid);
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

  constructor(
    window: Sdl.Video.Window,
    ctx: CanvasRenderingContext2D,
    dim: number = 3
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.gridSize = dim * dim;
    this.gameSize = this.gridSize * this.gridSize;

    // Create a new game grid
    this.gameGrid = new GameGrid(dim, {
      loc: { x: 0, y: 0 },
      size: { w: this.canvas.width, h: this.canvas.height },
    });

    // Start the animation timer
    setInterval(this.anim, this.animInterval, this, window);
  }
}
