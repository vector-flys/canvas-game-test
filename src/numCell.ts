/**
 * A number cell, which contains a number bounded by a shape
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";
import { Shapes } from "shapes-plus";

import { Coords, ObjSize, CellShapes } from "./lib/models";
import { ShapeNode } from "./shapeNode";
import { GameCell } from "./gameCell";

/**
 * Number cell - should be useful for both possibilties and clues
 *
 * Constructor
 *   @param num the number to be displayed
 *   @param ShapeNode parameters
 *   @param loc (the location within the gameGrid)
 */
export class NumCell extends ShapeNode {
  num: number; // The number of the cell / possibility

  // Set this directly to apply a shape to the cell
  cellShape: CellShapes = CellShapes.none;

  // Draw the cell according to its parameters
  draw(ctx: CanvasRenderingContext2D) {
    const width = this.size.w;
    const height = this.size.h;
    const x = this.loc.x - width / 2;
    const y = this.loc.y - height / 2;

    // console.log(
    //   `numCell[${this.num}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    // );

    // Create a shapes handler
    const shapes = new Shapes(ctx); // ctx object has the canvas property
    // this.text = this.shapes.createText();

    // Draw the cell background
    const rectangle = shapes.createRect();
    rectangle.draw({
      x: x,
      y: y,
      width: width,
      height: height,
      color: "black",
    });

    // Draw the cell shape
    if (this.cellShape == CellShapes.rectangle) {
      rectangle.draw({
        x: x + width * 0.1,
        y: y + height * 0.1,
        width: width * 0.8,
        height: height * 0.8,
        color: "red",
        bColor: "#70cf70",
        drawType: "outline",
      });
    } else if (this.cellShape == CellShapes.triangle) {
      const triangle = shapes.createTriangle();
      const sideLength = (height * 0.4) / Math.sqrt(3);
      triangle.draw({
        x: x + width / 2,
        y: y + height * 0.8,
        // size: sideLength,
        sideAB: sideLength,
        sideAC: sideLength,
        sideBC: sideLength,
        color: "red",
        bColor: "#70cf70",
        drawType: "fill",
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

    // // Add a 2-pixel border
    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(x, y, width, height);

    // Add the number
    ctx.fillStyle = "gray";
    ctx.font = `${height * 0.6}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.num), x + width / 2, y + height / 2);
  }

  constructor(num: number, loc: Coords, size: ObjSize, parent: GameCell) {
    super(loc, size, parent);

    this.num = num;
  }
}
