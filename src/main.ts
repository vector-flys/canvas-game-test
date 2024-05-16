/**
 * Use SDL2 to create a window and dump events to the console
 * https://github.com/kmamal/node-sdl
 *
 * Dependencies:
 *   npm install -g typescript @yao-pkg/pkg
 *
 * Distribution (depnds on Node 18)
 *   - macOS may need to set DYLD_LIBRARY_PATH to find SDL
 *   pkg .
 */
// doesn't work: process.env.DYLD_LIBRARY_PATH = __dirname + "/lib";

"use strict";

import { video } from "@kmamal/sdl";
import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
import { Game } from "./game";

const window = video.createWindow({ title: "Game Test", resizable: true });

var ctx: CanvasRenderingContext2D;
var canvas: Canvas | undefined = undefined;
var game: Game;

// The redraw wrapper for node-canvas
const redraw = () => {
  const { pixelWidth: width, pixelHeight: height } = window;

  // Initialize if we have not already done so
  if (!canvas) {
    canvas = createCanvas(width, height);
    ctx = canvas.getContext("2d");
    game = new Game(ctx);
    window.on("mouseButtonDown", (event) => {
      console.log("Context:", ctx);
      game.mouseHandler(event);
    });
    // window.on("mouseButtonUp", (event) => {
    //   game.mouseHandler(event);
    // });
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  // Draw the game object
  game?.redraw();

  const buffer = canvas.toBuffer("raw");
  window.render(width, height, width * 4, "bgra32", buffer);
};

window.on("resize", ({ pixelWidth: width, pixelHeight: height }) => {
  redraw();
});

// Gets called when the window is exposed
window.on("expose", redraw);

// Log everything to the console
// window.on("*", console.log);
