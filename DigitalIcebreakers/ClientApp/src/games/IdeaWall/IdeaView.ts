import * as PIXI from "pixi.js";
import {Idea} from "./Idea";
import {Point} from "./Point";

const TITLE_FONT_SIZE = 20;
const BODY_FONT_SIZE = 26;

export class IdeaView extends PIXI.Container {
    background: PIXI.Graphics;
    title: PIXI.Text;
    body: PIXI.Text;
    pointerData: Point | undefined;
    updatePosition: (x: number, y: number) => void;
    idea: Idea;

    constructor(idea: Idea, width: number, margin: number, showName: boolean, updatePosition: (x: number, y: number) => void) {
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
        this.addChild(this.background as PIXI.DisplayObject, this.title, this.body);
        this.alpha = .85;
        this.x = idea.x || 0;
        this.y = idea.y || 0;
    }

    onDragStart = (event: PIXI.interaction.InteractionEvent) => {
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

    onDragMove = (event: PIXI.interaction.InteractionEvent) => {
        if (this.pointerData) {
            const point = event.data.getLocalPosition(this.parent);
            const x = this.pointerData.x + point.x;
            const y = this.pointerData.y + point.y;
            this.position.set(x, y);
        }
    }
        
}