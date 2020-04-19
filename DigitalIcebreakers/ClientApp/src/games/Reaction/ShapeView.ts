import * as PIXI from "pixi.js";
import { Colors } from '../../Colors';
import { Shape } from './Shape';
import { ShapeType } from './ShapeType';

export class ShapeView {
    view: PIXI.Container;
    private countView: PIXI.Text;
    private count = 0;
    private first: PIXI.Text;
    private size: number;
    private graphics: PIXI.Graphics;
    private shape: Shape;
    private radius: number;
    get id() { return this.shape.id;}
    constructor(size: number, shape: Shape) {
        this.size = size;
        this.view = new PIXI.Container();
        this.countView = new PIXI.Text("", { fontSize: size / 5, fill: Colors.White});
        this.first = new PIXI.Text("?", {fontSize: size / 10, fill: Colors.BlueGrey.C500});
        this.shape = shape;
        this.radius = size * .9 / 2;
        this.graphics = this.draw();
        this.view.addChild<PIXI.Container>(this.graphics, this.countView, this.first);
        this.updateFirst("");
    }    

    private draw() {
        const graphics = new PIXI.Graphics()
            .beginFill(this.shape.color);

        return drawShape(graphics, this.shape.type, 0, 0, this.radius);
      }

    increment() {
        this.count++;
        this.countView.text = this.count.toString();
        this.countView.pivot.set(this.countView.width/2, this.countView.height/2);
    }

    updateFirst(first: string) {
        this.first.text = first;
        this.first.pivot.set (this.first.width/2, this.first.height / 2 - 20 - this.radius);
    }
}

export function drawShape(graphics: PIXI.Graphics, type: ShapeType, x: number, y: number, radius: number) : PIXI.Graphics {
    switch (type) {
        case ShapeType.Circle: return graphics.drawCircle(x, y, radius);
        case ShapeType.Square: return graphics.drawRect(x-radius, y-radius, 2 * radius, 2* radius)
        case ShapeType.Triangle: return graphics.drawPolygon([x+radius, y+radius, x, y-radius, x-radius, y+radius, x+radius, y+radius])
    }
}