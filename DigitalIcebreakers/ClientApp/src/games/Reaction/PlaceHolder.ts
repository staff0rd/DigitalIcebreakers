import * as PIXI from "pixi.js";
import { Colors } from "../../Colors";

export class Placeholder {
    private graphics: PIXI.Graphics;
    constructor() {
        this.graphics = new PIXI.Graphics();
    }

    attach(container: PIXI.Container) {
        this.graphics.clear();
        container.removeChild(this.graphics);
        this.graphics.lineStyle(1, Colors.BlueGrey.C500);
        this.graphics
            .drawRect(0, 0, container.width, container.height);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(container.width, container.height);
        this.graphics.moveTo(container.width, 0);
        this.graphics.lineTo(0, container.height);
        container.addChild(this.graphics);
    }
}