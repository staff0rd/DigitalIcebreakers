import * as PIXI from "pixi.js";
import { intersects } from '../../util/intersects';

const TITLE_FONT_SIZE = 20;
const BODY_FONT_SIZE = 26;

export class IdeaView extends PIXI.Container {
    constructor(idea, width, margin, showName, updatePosition) {
        super();

        this.idea = idea;

        this.updatePosition = updatePosition;
        
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', this.onDragStart);
        this.on('pointermove', this.onDragMove);
        this.on('pointerup', this.onDragEnd);
        this.on('pointerupoutside', this.onDragEnd);

        this.background = new PIXI.Graphics();
        this.background.beginFill(idea.color);
        this.background.drawRect(0, 0, width, width);
        this.background.endFill();
        this.title = new PIXI.Text(idea.playerName, { fontSize: TITLE_FONT_SIZE });
        this.title.x = margin;
        this.title.visible = showName;
        this.body = new PIXI.Text(idea.idea, { fontSize: BODY_FONT_SIZE, breakWords: true, wordWrap: true, wordWrapWidth: width - 2*margin, align: "center"});
        this.body.pivot.set(this.body.width/2, this.body.height/2)
        this.body.position.set(width / 2, width / 2);
        this.addChild(this.background, this.title, this.body);
        this.alpha = .85;
        this.x = idea.x || 0;
        this.y = idea.y || 0;
    }

    onDragStart = (event) => {
        const point = event.data.getLocalPosition(this.parent);
        this.pointerData = { x: this.x - point.x, y: this.y - point.y };
        this.parent.addChild(this);
    }

    onDragEnd = () => {
        this.pointerData = undefined;
        this.idea.x = this.x;
        this.idea.y = this.y;
        this.updatePosition(this.x, this.y);
    }

    onDragMove = (event) => {
        if (this.pointerData) {
            const point = event.data.getLocalPosition(this.parent);
            const x = this.pointerData.x + point.x;
            const y = this.pointerData.y + point.y;
            this.position.set(x, y);
        }
    }
        
}