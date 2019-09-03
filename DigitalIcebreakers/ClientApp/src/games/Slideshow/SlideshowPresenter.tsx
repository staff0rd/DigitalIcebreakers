import React from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame';
import Reveal, {SlideEvent} from 'reveal.js'
import { Slides } from './Slides'

declare var window: any;

interface SlideshowPresenterState {
    count: number;
    value: string;
}
interface SlideshowProps extends BaseGameProps {
    storageKey: string;
}

export class SlideshowPresenter extends BaseGame<SlideshowProps, SlideshowPresenterState> {
    displayName = SlideshowPresenter.name

    constructor(props: SlideshowProps) {
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
        Reveal.removeEventListener('fragmenthidden');
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

        const state = this.getFromStorage(this.props.storageKey);
        if (state)
            Reveal.slide( state.indexh, state.indexv, state.indexf);

        Reveal.addEventListener( 'slidechanged', (event: SlideEvent ) => this.reportState());
        Reveal.addEventListener( 'fragmentshown', (event: SlideEvent ) => this.reportState());
        Reveal.addEventListener( 'fragmenthidden', (event: SlideEvent ) => this.reportState());
    }

    reportState() {
        const state = Reveal.getState();
        this.adminMessage(state);
        this.saveToStorage(this.props.storageKey, state);
    }

    render() {
        return (
            <div className="classHtml">
                <div className="classBody">
                    <div className="reveal presenter">
                        <Slides />
                    </div>
                </div>
            </div>
        );
    }
}
