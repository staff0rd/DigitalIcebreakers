import { Colors } from '../../Colors';
import * as PIXI from "pixi.js";

export class Graph {
    constructor(app, data) {
        this.app = app;
        this.data = data;

        this.app.stage.removeChildren();

        this.data.forEach((_, ix) => {
            const bar = this.getBar(ix);
            this.app.stage.addChild(bar);
        });
    }

    getBar(position) {
        const count = this.data.length;
        const value = this.data[position].value;
        const color = this.data[position].color;
        const label = this.data[position].label;
        const total = this.data.sum(p => p.value);

        const outline = Colors.BlueGrey.C500;
        
        const barWidth = this.app.screen.width / ((count + 1) + count * 2) * 2;
        const labelFontSize = barWidth / 5;
        const valueFontSize = barWidth / 3;
        //const units = Math.max(total / 2, ...this.data.map(p => p.value));
        const units = this.data.length + 1;
        const unitHeight = (this.app.screen.height - barWidth) / units;
        const bottom = this.app.screen.height - barWidth / 2;
        const leftSideOfBar = barWidth / 2 + barWidth / 2 * position + barWidth * position;

        const container = new PIXI.Container();

        const bar = new PIXI.Graphics();
        bar.beginFill(color);
        bar.drawRect(leftSideOfBar, bottom - value * unitHeight, barWidth, value * unitHeight);
        bar.pivot.set(0, )
        bar.endFill();

        const line = new PIXI.Graphics();
        bar.lineStyle(2, outline);
        bar.moveTo(leftSideOfBar - 10, bottom);
        bar.lineTo(leftSideOfBar + barWidth + 10, bottom);

        const txtLabel = new PIXI.Text(label, { fontSize: labelFontSize });
        txtLabel.position.set(leftSideOfBar + barWidth / 2, this.app.screen.height - barWidth / 2);
        txtLabel.pivot.set(txtLabel.width / 2, 0);

        const txtValue = new PIXI.Text(value, { fontSize: valueFontSize });
        txtValue.position.set(leftSideOfBar + barWidth / 2, bottom - value * unitHeight);
        txtValue.pivot.set(txtValue.width / 2, txtValue.height);

        container.addChild(bar, line, txtLabel, txtValue);
        
        return container;
    }
}