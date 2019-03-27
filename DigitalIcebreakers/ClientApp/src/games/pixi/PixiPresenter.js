import { BaseGame } from '../BaseGame'
import { Events } from '../../Events';
import * as PIXI from "pixi.js";
import React from 'react';

export class PixiPresenter extends BaseGame {
    constructor(backgroundColor, props, context) {
        super(props, context);

        this.app = new PIXI.Application({ autoResize: true, backgroundColor: backgroundColor });
        
        this.pixiElement = null;
    }

    pixiUpdate = (element) => {
        this.pixiElement = element;

        if (this.pixiElement && this.pixiElement.children.length <= 0) {
            this.pixiElement.appendChild(this.app.view);
            this.app.renderer.resize(element.clientWidth, element.clientHeight);

            this.init();    
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const resize = () => {
            const parent = this.app.view.parentNode;
            this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
            this.init();
        }

        Events.add('onresize', 'presenter', resize);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        Events.remove('onresize', 'presenter');
    }

    render() {
        return <div className='main full-height' ref={this.pixiUpdate} />;
    }
}