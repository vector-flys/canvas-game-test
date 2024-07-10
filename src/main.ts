/**
 * Use SDL2 to create a window and dump events to the console
 * https://github.com/kmamal/node-sdl
 *
 * Dependencies:
 *   npm install -g typescript @yao-pkg/pkg
 *
 * Node.js v 18 (lts/hydrogen)
 *   nvm install lts/hydrogen --reinstall-packages-from=current
 *   nvm alias default lts/hydrogen
 *
 * Distribution (depnds on Node 18)
 *   - macOS may need to set DYLD_LIBRARY_PATH to find node-sdl
 */

// doesn't work: process.env.DYLD_LIBRARY_PATH = __dirname + "/lib";

"use strict";

import { Events, video } from "@kmamal/sdl";
import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
// import { Game } from "./game-sandbox";  // Shapegrid test
// import { Game } from "./game-sudoku";
// import { Game } from "./game";  // Generic shapes
import { Game } from "./game-mastermind";

const window = video.createWindow({ title: "Game Test", resizable: true });

var ctx: CanvasRenderingContext2D;
var canvas: Canvas | undefined = undefined;
var game: Game;

// The redraw wrapper for node-canvas
const redraw = () => {
  const { pixelWidth: width, pixelHeight: height } = window;
  console.log("main.redraw()", width, height);

  // Initialize if we have not already done so
  if (!canvas) {
    canvas = createCanvas(width, height);
    ctx = canvas.getContext("2d");
    game = new Game(window, ctx, 3);
    window.on("mouseButtonDown", (event) => {
      let mouseEvent: Events.Window.MouseButtonEvent = {
        type: event.type,
        button: event.button,

        // Adjust for window pixel width/height
        x: (event.x * window.pixelWidth) / window.width,
        y: (event.y * window.pixelHeight) / window.height,
        touch: event.touch,
      };
      game.mouseHandler(mouseEvent as any);
    });
    // window.on("mouseButtonUp", (event) => {
    //   game.mouseHandler(event);
    // });
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  // Draw the game object
  game.redraw();

  // Update the contents of the window
  const buffer = canvas.toBuffer("raw");
  window.render(width, height, width * 4, "bgra32", buffer);
};

window.on("resize", ({ pixelWidth: width, pixelHeight: height }) => {
  redraw();
});

// Gets called when the window is exposed (seems to cause extra redraw)
// window.on("expose", redraw);

// Log everything to the console
// window.on("*", console.log);
