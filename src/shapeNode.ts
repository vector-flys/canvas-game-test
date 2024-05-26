/**
 * A generic class for shape nodes
 */

import { CanvasRenderingContext2D } from "canvas";
import { Coords, ObjSize, CellShapes } from "./lib/models";

export interface ShapeNodeParameters {
  loc: Coords;
  size: ObjSize;
  name?: string;
}

interface childList {
  child: ShapeNode;
  children: childList[];
}

export class ShapeNode {
  base: Coords; // topLeft corner (x, y)
  name: string;
  loc: Coords; // x, y of shape center
  size: ObjSize;
  parent: ShapeNode | undefined;
  children: ShapeNode[] = [];

  /**
   * Find topLeft
   */
  topLeft(): Coords {
    let topLeft = {
      x: this.loc.x - this.size.w / 2,
      y: this.loc.y - this.size.h / 2,
    };
    if (this?.parent) {
      topLeft.x += this.parent.base.x;
      topLeft.y += this.parent.base.y;
    }
    return topLeft;
  }

  /**
   * Fill the node with a solid color
   */
  fill(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(this.base.x, this.base.y, this.size.w, this.size.h);
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
    if (this.bounds(loc)) {
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
    this.parent = parent;

    // Children will use base as (0, 0)
    this.base = this.topLeft();

    if (parent) {
      parent.children.push(this);
    }
    // console.log("shapeNode", this
    // console.log("base", this.base);
  }
}
