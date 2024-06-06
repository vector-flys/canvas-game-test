/**
 * A number cell, which contains a number bounded by a shape
 */

"use strict";

import { CanvasRenderingContext2D } from "canvas";

import { CellShapes } from "./lib/models";
import { ShapeNode, ShapeNodeParameters } from "./shapeNode";
import { CellGrid, GameCell } from "./gameCell";
import { Shapes } from "shapes-plus";
import { ShapeGridElement } from "./shapeGrid";

/**
 * Number cell - should be useful for both possibilties and clues
 *
 * Constructor
 *   @param num the number to be displayed
 *   @param ShapeNode parameters
 *   @param loc (the location within the gameGrid)
 */
export class NumCell extends ShapeGridElement {
  num: number; // The number of the cell / possibility
  showPoss: boolean = true;
  shapes: Shapes;

  // Set this directly to apply a shape to the cell
  cellShape: CellShapes = CellShapes.none;

  // Set this directly to apply foreground color to the number
  numColor: string = "gray";

  // Draw the cell according to its parameters
  draw() {
    const width = this.size.w;
    const height = this.size.h;
    const x = this.base.x + width * 0.15;
    const y = this.base.y + height * 0.15;

    console.log(
      `numCell[${this.num}].draw([${this.loc.x}, ${this.loc.y}] ${this.size.w}x${this.size.h})`
    );

    // Draw the cell background
    this.fill("black");

    // Don't draw the shape if the number is not possible
    if (!this.showPoss) return;

    // Draw the cell shape
    if (this.cellShape == CellShapes.rectangle) {
      const rectangle = this.shapes.createRect();
      rectangle.draw({
        x: x,
        y: y,
        width: width * 0.7,
        height: height * 0.7,
        color: "red",
        bColor: "#70cf70",
        drawType: "outline",
      });
    } else if (this.cellShape == CellShapes.triangle) {
      const triangle = this.shapes.createEquiTriangle();
      triangle.draw({
        x: this.base.x + width / 2,
        y: this.base.y + height / 2.1,
        height: height * 0.8,
        color: "red",
        bColor: "#70cf70",
        drawType: "outline",
      });
    } else if (this.cellShape == CellShapes.circle) {
      const circle = this.shapes.createCircle();
      const radius = height * 0.35; // (width + height) / 5;
      circle.draw({
        x: this.base.x + width / 2,
        y: this.base.y + height / 2,
        color: "red",
        bColor: "#70cf70",
        radius: radius,
        drawType: "outline",
      });
    }

    // Add the number
    this.drawText(String(this.num), "gray");
  }

  redraw(): void {
    super.redraw();
    this.draw();
  }

  constructor(num: number, param: ShapeNodeParameters, parent?: ShapeNode) {
    super(num, param, parent);
    this.num = num;

    // Create a shapes handler
    this.shapes = new Shapes(this.ctx); // ctx object has the canvas property
  }
}
