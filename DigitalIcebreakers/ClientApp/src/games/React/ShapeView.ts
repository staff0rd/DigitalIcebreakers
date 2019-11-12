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
        this.graphics = new PIXI.Graphics()
            .beginFill(shape.color)
            .drawCircle(0, 0, this.radius);
        this.view.addChild<PIXI.Container>(this.graphics, this.countView, this.first);
        this.updateFirst("");
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