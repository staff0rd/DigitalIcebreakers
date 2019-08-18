import React from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame';
import Reveal, {SlideEvent} from 'reveal.js'
import { Slides } from './Slides'

declare var window: any;

interface SlideshowPresenterState {
    count: number;
    value: string;
}

export class SlideshowPresenter extends BaseGame<BaseGameProps, SlideshowPresenterState> {
    displayName = SlideshowPresenter.name

    constructor(props: BaseGameProps) {
        super(props);
        
        this.state = {
            count: 0,
            value: ""
        };
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        Reveal.removeEventListener('slidechanged');
        Reveal.removeEventListener('fragmentshown');
    }

    componentDidMount() {
        super.componentDidMount();
        window.Reveal = Reveal;
        Reveal.initialize({
            dependencies: [
                // { src: 'plugin/markdown/marked.js' },
                // { src: 'plugin/markdown/markdown.js' },
                { src: 'plugin/notes/notes.js', async: true },
                { src: 'plugin/highlight/highlight.js', async: true }
            ]
        });

        Reveal.addEventListener( 'slidechanged', (event: SlideEvent ) => this.reportState());
        Reveal.addEventListener( 'fragmentshown', (event: SlideEvent ) => this.reportState());
        Reveal.addEventListener( 'fragmenthidden', (event: SlideEvent ) => this.reportState());
    }

    reportState() {
        this.adminMessage(Reveal.getState());
    }

    render() {
        return (
            <div className="classHtml">
                <div className="classBody">
                    <div className="reveal">
                        <Slides />
                    </div>
                </div>
            </div>
        );
    }
}
