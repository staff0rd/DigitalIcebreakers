import React from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame';
import { Slides } from './Slides'
import Reveal from 'reveal.js'

interface SlideshowClientState {
    value: string;
}

declare var window: any;

export class SlideshowClient extends BaseGame<BaseGameProps, SlideshowClientState>  {
    displayName = SlideshowClient.name

    constructor(props: BaseGameProps) {
        super(props);

        this.state = {
            value: ""
        };
    }

    componentDidMount() {
        super.componentDidMount();
        window.Reveal = Reveal;
        Reveal.initialize({
            controls: false,
            touch: false,
            overview: false,
            keyboard: false,
            progress: false,
            dependencies: [
                // { src: 'plugin/markdown/marked.js' },
                // { src: 'plugin/markdown/markdown.js' },
                { src: 'plugin/notes/notes.js', async: true },
                { src: 'plugin/highlight/highlight.js', async: true }
            ]
        });
        this.props.connection.on("gameUpdate", (state) => {
            Reveal.slide( state.indexH, state.indexV, state.indexF);
        });
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
