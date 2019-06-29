import { Colors } from '../../Colors';
import * as PIXI from "pixi.js";

export class Graph {
    private app: PIXI.Application;
    private data: any[];

    constructor(app: PIXI.Application, data: any[]) {
        this.app = app;
        this.data = data;

        this.app.stage.removeChildren();

        this.data.forEach((_, ix) => {
            const bar = this.getBar(ix);
            this.app.stage.addChild(bar);
        });
    }

    getBar(position: number) {
        const count = this.data.length;
        const value = Math.max(this.data[position].value, 0);
        const color = this.data[position].color;
        const label = this.data[position].label;

        const outline = Colors.BlueGrey.C500;
        
        const barWidth = this.app.screen.width / ((count + 1) + count * 2) * 2;
        const labelFontSize = barWidth / 5;
        const valueFontSize = barWidth / 3;
        const units = Math.max(...this.data.map(p => p.value));
        const unitHeight = units > 0 ? (this.app.screen.height - barWidth) / units :  0;
        const bottom = this.app.screen.height - barWidth / 2;
        const leftSideOfBar = barWidth / 2 + barWidth / 2 * position + barWidth * position;

        const container = new PIXI.Container();

        const bar = new PIXI.Graphics();
        bar.beginFill(color);
        bar.drawRect(leftSideOfBar, bottom - value * unitHeight, barWidth, value * unitHeight);
        bar.pivot.set(0);
        bar.endFill();

        const line = new PIXI.Graphics();
        bar.lineStyle(2, outline);
        bar.moveTo(leftSideOfBar - 10, bottom);
        bar.lineTo(leftSideOfBar + barWidth + 10, bottom);

        const txtLabel = new PIXI.Text(label, { fontSize: labelFontSize });
        txtLabel.position.set(leftSideOfBar + barWidth / 2, this.app.screen.height - barWidth / 2);
        txtLabel.pivot.set(txtLabel.width / 2, 0);

        const txtValue = new PIXI.Text(value.toString(), { fontSize: valueFontSize });
        txtValue.position.set(leftSideOfBar + barWidth / 2, bottom - value * unitHeight);
        txtValue.pivot.set(txtValue.width / 2, txtValue.height);

        container.addChild(bar, line, txtLabel as PIXI.Container, txtValue);
        
        return container;
    }
}