/**
 * A generic class for shape nodes
 */

import { CanvasRenderingContext2D } from "canvas";
import { Coords, ObjSize } from "./lib/models";

export interface ShapeNodeParameters {
  ctx?: CanvasRenderingContext2D;
  loc: Coords;
  size: ObjSize;
  name?: string;
  clickable?: boolean;
}

interface childList {
  child: ShapeNode;
  children: childList[];
}

export class ShapeNode {
  base: Coords; // topLeft corner (x, y)
  name: string;
  ctx: CanvasRenderingContext2D;
  loc: Coords; // x, y of shape center (0,0 = center of canvas)
  size: ObjSize;
  parent: ShapeNode | undefined;
  clickable: boolean;
  children: ShapeNode[] = [];

  /**
   * Find topLeft
   */
  topLeft(): Coords {
    const ctxCenter: Coords = {
      x: this.ctx.canvas.width / 2,
      y: this.ctx.canvas.height / 2,
    };
    let topLeft = {
      x: ctxCenter.x + this.loc.x - this.size.w / 2,
      y: ctxCenter.y + this.loc.y - this.size.h / 2,
    };
    // if (this?.parent) {
    //   topLeft.x += this.parent.base.x;
    //   topLeft.y += this.parent.base.y;
    // }
    return topLeft;
  }

  /**
   * Set the location
   */
  setLoc(loc: Coords = { x: 0, y: 0 }): void {
    this.loc = loc;
    this.base = this.topLeft();
  }

  /**
   * Set the size
   */
  setSize(size: ObjSize): void {
    this.size = size;
    this.base = this.topLeft();
  }

  /**
   * Fill the node with a solid color
   */
  fill(color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.base.x, this.base.y, this.size.w, this.size.h);
  }

  /**
   * Draw a border around the node
   */
  drawBorder(color: string): void {
    this.ctx.strokeStyle = color;
    this.ctx.strokeRect(this.base.x, this.base.y, this.size.w, this.size.h);
  }

  /**
   * Draw text centered
   */
  drawText(text: string, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${this.size.h * 0.6}px Arial`;
    this.ctx.fillText(
      text,
      this.base.x + this.size.w / 2,
      this.base.y + this.size.h / 2
    );
  }

  /**
   * Function to check if a location is within the bounds of the shape
   *
   * @param loc - x, y coordinates
   * @return boolean - true if the location is within the bounds of the shape
   */
  bounds(loc: Coords): boolean {
    // console.log("bounds test", loc, topLeft, this.size);
    if (
      loc.x >= this.base.x &&
      loc.x <= this.base.x + this.size.w &&
      loc.y >= this.base.y &&
      loc.y <= this.base.y + this.size.h
    ) {
      return true;
    }
    return false;
  }

  /**
   * Function to check return a list of children matching a click
   *
   * @param loc - x, y coordinates
   * @return an array of ShapeNodes
   */
  childHits(loc: Coords): ShapeNode[] {
    let shapeNodes: ShapeNode[] = [];
    if (this.clickable && this.bounds(loc)) {
      shapeNodes.push(this);
    }
    for (let child of this.children) {
      shapeNodes.push(...child.childHits(loc));
    }
    return shapeNodes;
  }

  /**
   * Add a child node
   * @param ShapeNodeParameters
   */
  addChild(child: ShapeNodeParameters): ShapeNode {
    const shapeNode = new ShapeNode(child, this);
    shapeNode.name = child.name || "generic child";
    return shapeNode;
  }

  /**
   *  List all children
   *
   */
  listChildren(): childList[] {
    let shapeNodes: any = []; //ShapeNode[] = [];
    for (let child of this.children) {
      shapeNodes.push({ child: child, children: child.listChildren() });
    }
    return shapeNodes;
  }

  constructor(
    param: ShapeNodeParameters,
    parent: ShapeNode | undefined = undefined
  ) {
    this.loc = param.loc;
    this.size = param.size;
    this.name = param.name || "generic shapeNode";
    this.clickable = param.clickable || false;
    this.parent = parent;

    if (param?.ctx && this?.parent) {
      if (this.parent.ctx !== param.ctx) {
        throw new Error("Canvas child context must match parent");
      }
      this.ctx = this.parent.ctx;
    }

    if (this?.parent) {
      // Child loc is relative to parent center
      this.loc.x += this.parent.loc.x;
      this.loc.y += this.parent.loc.y;

      this.ctx = this.parent.ctx;
    } else if (param?.ctx) {
      this.ctx = param.ctx;
    } else {
      throw new Error("Canvas context must be provided");
    }

    // This is for handy reference filling and checking bounds
    this.base = this.topLeft();
    // console.log("shapeNode %s, topLeft = %s", this.name, this.topLeft());

    if (parent) {
      parent.children.push(this);
    }
    // console.log("shapeNode", this
    // console.log("base", this.base);
  }
}
