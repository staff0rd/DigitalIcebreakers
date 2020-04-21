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
    ideaUpdated: (idea: Idea) => void;
    idea: Idea;
    size: number;

    constructor(idea: Idea, size: number, margin: number, showName: boolean, laneWidth: number, ideaUpdated: (idea: Idea) => void) {
        super();

        this.idea = { ...idea };
        this.size = size;

        this.ideaUpdated = ideaUpdated;
        
        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', this.onDragStart);
        this.on('pointermove', this.onDragMove);
        this.on('pointerup', this.onDragEnd);
        this.on('pointerupoutside', this.onDragEnd);
        
        this.title = this.getTitle(idea.playerName, margin, showName);
        this.body = this.getBody(size, laneWidth, margin, idea.idea);
        this.background = this.getBackground(idea.color, size || this.body.width + 2*margin, size || this.body.height + 2*margin);
        
        this.addChild(this.background as PIXI.DisplayObject, this.title, this.body);
        this.alpha = .85;
        this.x = idea.x || 0;
        this.y = idea.y || 0;
    }

    private getBackground(color: number, width: number, height: number) {
        const background = new PIXI.Graphics();
        background.beginFill(color);
        background.drawRect(0, 0, width, height);
        background.endFill();
        return background;
    }

    getTitle(playerName: string, margin: number, showName: boolean) {
        const title = new PIXI.Text(playerName, { fontSize: TITLE_FONT_SIZE });
        title.x = margin;
        title.visible = showName;
        return title;
    }

    getBody(width: number, laneWidth: number, margin: number, content: string) {
        const wordWrapWidth = width ? width - 2*margin : laneWidth - 4*margin;
        const body = new PIXI.Text(content, { fontSize: BODY_FONT_SIZE, breakWords: true, wordWrap: true, wordWrapWidth: wordWrapWidth, align: "center"});
        if (this.size) {
            body.pivot.set(body.width/2, body.height/2)
            body.position.set(this.size / 2, this.size / 2);
        }
        return body;
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
        this.ideaUpdated(this.idea);
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