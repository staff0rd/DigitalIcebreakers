import * as PIXI from "pixi.js";

export class Button extends PIXI.Container {
    g1: PIXI.Graphics;
    g2: PIXI.Graphics;

    constructor(onPointerUp: Function, onPointerDown: Function) {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.g1 = new PIXI.Graphics();
        this.g2 = new PIXI.Graphics();
        this.addChild(this.g1);
        this.addChild(this.g2);
        this.on('pointerdown', () => this.down(onPointerDown));
        this.on('pointerup', () => this.up(onPointerUp));
        this.on('pointerupoutside', () => this.up(onPointerUp));
    }

    up(callback: Function) {
        this.g2.alpha = 1;
        callback();
    }

    down(callback: Function) {
        this.g2.alpha = 0;
        callback();
    }

    render(upColor: number, downColor: number, x: number, y: number, width: number, height: number) {
        this.g1.clear();
        this.g1.beginFill(downColor);
        console.log(x, y, width, height);
        this.g1.drawRect(x, y, width, height);
        this.g1.endFill();
        this.g2.clear();
        this.g2.beginFill(upColor);
        this.g2.drawRect(x, y, width, height);
        this.g2.endFill();
    }

}