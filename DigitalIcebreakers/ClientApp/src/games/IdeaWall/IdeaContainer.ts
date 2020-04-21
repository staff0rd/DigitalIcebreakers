import { clamp } from '../../util/clamp';
import * as PIXI from "pixi.js";
import { IdeaView } from './IdeaView';
import { Point } from './Point';
import { intersects } from '../../util/intersects';
import { Idea } from './Idea';

export interface Lane {
    name: string;
    id: number;
};

export class IdeaContainer {
    private app: PIXI.Application;
    private ideaWidth: number;
    private margin: number;
    private pointerData: Point | undefined;
    private ideaContainerDrag!: PIXI.Graphics;
    private ideaContainer: PIXI.Container;
    private lanes: Lane[];
    private laneContainer: PIXI.Container;
    private laneLabelBotom = 0;
    
    constructor(app: PIXI.Application, ideaWidth: number, margin: number, lanes: Lane[] = []) {
        this.ideaContainer = new PIXI.Container();
        this.laneContainer = new PIXI.Container();
        
        this.app = app;
        
        this.ideaWidth = ideaWidth;
        
        this.margin = margin;
        
        this.setupDrag();
        
        this.pointerData = undefined;
        
        this.lanes = lanes;


        
        if (this.lanes.length)
        this.setupLanes();
    }
    
    addToStage(stage: PIXI.Container) {
        stage.addChild(this.laneContainer, this.ideaContainerDrag as PIXI.DisplayObject, this.ideaContainer);
    }

    reset() {
        this.ideaContainer.position.set(0)
    }

    clear() {
        this.ideaContainer.removeChildren();
    }

    setupLanes() {
        this.laneContainer.removeChildren();
        this.lanes.forEach((lane, ix) => {
            const label = new PIXI.Text(lane.name);
            label.anchor.set(.5, 0);
            label.position.set(ix * this.laneWidth + this.laneWidth/2, this.margin);
            this.laneContainer!.addChild(label);
            this.laneLabelBotom = label.position.y + label.height + this.margin;
        });

        for (let i = 1; i < this.lanes.length; i++) {
            const g = new PIXI.Graphics();
            g.lineStyle(3, 0x000000);
            g.moveTo(i * this.laneWidth, this.margin);
            g.lineTo(i * this.laneWidth, this.app.screen.height);
            this.laneContainer.addChild(g);
        }
    }

    private setupDrag() {
        this.ideaContainerDrag = new PIXI.Graphics();
        this.ideaContainerDrag.interactive = true;
        this.ideaContainerDrag.beginFill(0xFF00000, 0)
        this.ideaContainerDrag.drawRect(0, 0, 1, 1);
        this.ideaContainerDrag.endFill();

        this.ideaContainerDrag.interactive = true;
        this.ideaContainerDrag.buttonMode = true;
        this.ideaContainerDrag.on('pointerdown', this.onDragStart);
        this.ideaContainerDrag.on('pointermove', this.onDragMove);
        this.ideaContainerDrag.on('pointerup', this.onDragEnd);
        this.ideaContainerDrag.on('pointerupoutside', this.onDragEnd);
    }

    add(idea: IdeaView, isNew: boolean = false) {
        if (idea.idea.x === undefined || idea.idea.y === undefined) {
            const point = this.getNextFreeSpot(idea.idea.lane);
            idea.x = point.x
            idea.y = point.y;
            idea.onDragEnd();
        } else {
            idea.x = idea.idea.x;
            idea.y = idea.idea.y;
        }

        this.ideaContainer.addChild(idea);
    }

    containsIdea(idea: Idea): boolean
    {
        return !!this.ideaContainer.children.find(i => (i as IdeaView).idea && (i as IdeaView).idea.id === idea.id);
    }

    public get laneWidth()  {
        return this.app.screen.width / (this.lanes.length || 1);
    }

    private getNextFreeSpot(laneId: number) : Point {
        let columns = Math.floor(this.laneWidth / this.ideaWidth) || 1;
        let row = 0;
        while(row < 50) {
            for (let column = 0; column < columns; column++) {
                const x = this.laneWidth * laneId + column * this.ideaWidth + this.margin * column - this.ideaContainer.x;
                const y = this.laneLabelBotom + row * this.ideaWidth + this.margin * row - this.ideaContainer.y;
                if (this.checkIsEmpty(x, y, laneId)) {
                    return {x, y}
                }
            }
            row++;
        }
        return {x: 0, y: 0};
    }

    private checkIsEmpty(x: number, y: number, laneId: number) {
        const rect = {x: x, y: y, width: this.ideaWidth, height: this.ideaWidth};
        return this.ideaContainer.children
            .filter((c) => {
            const iv = c as IdeaView;
            return intersects(iv, rect) && iv.idea.lane === laneId;
        }).length === 0
    }

    private onDragStart = (event: PIXI.interaction.InteractionEvent)  => {
        const point = event.data.getLocalPosition(this.app.stage);
        this.pointerData = { x: this.ideaContainer.x - point.x, y: this.ideaContainer.y - point.y };
    }

    private onDragEnd = () => {
        this.pointerData = undefined;
    }

    private onDragMove = (event: PIXI.interaction.InteractionEvent) => {
        if (this.pointerData) {
            const point = event.data.getLocalPosition(this.app.stage);
            const x = this.pointerData.x + point.x;
            const y = this.pointerData.y + point.y;
            const mostTop = Math.min(...this.ideaContainer.children.map(p => this.app.screen.y - p.y))
            let mostLeft = Math.max(...this.ideaContainer.children.map(p => p.x))
            const mostRight = Math.max(...this.ideaContainer.children.map(p => this.app.screen.width - p.x - this.ideaWidth));
            const mostBottom = Math.max(...this.ideaContainer.children.map(p => this.app.screen.height - p.y - this.ideaWidth));
            this.ideaContainer.position.set(clamp(x, -mostLeft, mostRight), clamp(y, mostTop, mostBottom));
        }
    }

    resize() {
        this.ideaContainerDrag.width = this.app.screen.width;
        this.ideaContainerDrag.height = this.app.screen.height;
        this.setupLanes();
    }

    arrange() {
        this.ideaContainer.position.set(0);
        const gap = this.ideaWidth + this.margin;
        let columns = Math.floor(this.app.screen.width / gap);

        if (columns * gap - this.margin + this.ideaWidth <= this.app.screen.width)
            columns++;
        
        const ideas = [...this.ideaContainer.children];
        this.ideaContainer.removeChildren();

        ideas.forEach((c,  i) => {
            const iv = c as IdeaView;
            const point = this.getNextFreeSpot(iv.idea.lane);
            iv.position.set(point.x, point.y);
            this.ideaContainer.addChild(iv);
            iv.onDragEnd(); // saves position
        })
    }
}