import { clamp } from '../../util/clamp';
import * as PIXI from "pixi.js";

export class IdeaContainer extends PIXI.Container {
    constructor(app, ideaWidth) {
        super();

        this.app = app;
        
        this.ideaWidth = ideaWidth;

        this.setupDrag();

        this.pointerData = undefined;
    }

    setupDrag() {
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

    getDragContainer() {
        return this.ideaContainerDrag;
    }

    onDragStart = (event) => {
        const point = event.data.getLocalPosition(this.app.stage);
        this.pointerData = { x: this.x - point.x, y: this.y - point.y };
    }

    onDragEnd = () => {
        this.pointerData = undefined;
    }

    onDragMove = (event) => {
        if (this.pointerData) {
            const point = event.data.getLocalPosition(this.app.stage);
            const x = this.pointerData.x + point.x;
            const y = this.pointerData.y + point.y;
            const mostTop = Math.min(...this.children.map(p => this.app.screen.y - p.y))
            const mostLeft = Math.min(...this.children.map(p => p.x))
            const mostRight = Math.max(...this.children.map(p => this.app.screen.width - p.x - this.ideaWidth));
            const mostBottom = Math.max(...this.children.map(p => this.app.screen.height - p.y - this.ideaWidth));
            this.position.set(clamp(x, mostLeft, mostRight), clamp(y, mostTop, mostBottom));
        }
    }

    resize() {
        this.ideaContainerDrag.width = this.app.screen.width;
        this.ideaContainerDrag.height = this.app.screen.height;
    }
}