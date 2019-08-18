import React from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame';
import Reveal from 'reveal.js'

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

    componentDidMount() {
        super.componentDidMount();
        Reveal.initialize({
            dependencies: [
                // { src: 'plugin/markdown/marked.js' },
                // { src: 'plugin/markdown/markdown.js' },
                { src: 'plugin/notes/notes.js', async: true },
                { src: 'plugin/highlight/highlight.js', async: true }
            ]
        });
        // this.props.connection.on("gameUpdate", (result) => {
        //     if (result === "d") {
        //         this.setState(prevState => {
        //             return {count: prevState.count+1};
        //         });
        //     }
        // });
    }

    render() {
        return (
            <div className="classHtml">
                <div className="head" style={ { height: '0px'}}>
                    <link rel="stylesheet" href="css/reset.css" />
                    <link rel="stylesheet" href="css/reveal.css" />
                    <link rel="stylesheet" href="css/theme/black.css" />
                    <link rel="stylesheet" href="lib/css/monokai.css" />
                </div>
                <div className="classBody">
                    <div className="reveal">
                        <div className="slides">
                            <section>Slide 1</section>
                            <section>Slide 2</section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
