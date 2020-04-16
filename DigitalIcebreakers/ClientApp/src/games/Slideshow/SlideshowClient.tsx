import React from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame';
import { Slides } from './Slides'
import Reveal from 'reveal.js'

import { setGameMessageCallback } from '../../store/connection/actions';
import { connect, ConnectedProps } from 'react-redux';

const connector = connect(
    null,
    { setGameMessageCallback }
);
  
type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

interface SlideshowClientState {
    value: string;
}

declare var window: any;

class SlideshowClient extends BaseGame<PropsFromRedux, SlideshowClientState>  {
    displayName = SlideshowClient.name

    constructor(props: PropsFromRedux) {
        super(props);

        this.state = {
            value: ""
        };
    }

    componentDidMount() {
        window.Reveal = Reveal;
        Reveal.uninitialize();
        Reveal.initialize({
            controls: false,
            touch: false,
            overview: false,
            keyboard: false,
            progress: false,
            transition: 'none',
            backgroundTransition: 'none',
            dependencies: [
                { src: 'plugin/notes/notes.js', async: true },
                { src: 'plugin/highlight/highlight.js', async: true }
            ]
        });
        this.props.setGameMessageCallback((state: any) => {
            Reveal.slide( state.indexH, state.indexV, state.indexF);
        });
    }

    render() {
        return (
            <div className="classHtml">
                <div className="classBody">
                    <div className="reveal client">
                        <Slides isPresenter={false} />
                    </div>
                </div>
            </div>
        );
    }
}
