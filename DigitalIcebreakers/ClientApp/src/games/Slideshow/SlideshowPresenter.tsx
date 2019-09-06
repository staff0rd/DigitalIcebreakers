import React, {Fragment} from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame';
import Reveal from 'reveal.js'
import { Slides } from './Slides'
import { Button, FormGroup, Navbar } from 'react-bootstrap';
import { Events } from '../../Events'

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

        this.setMenuItems();
    }

    reset() {
        Reveal.setState({ indexh: 0, indexv: 0, indexf: 0});
    }

    setMenuItems() {
        const header = (
            <Fragment>
                <Navbar.Form>
                    <FormGroup>
                        <Button bsStyle="primary" onClick={this.reset}>Reset</Button>
                    </FormGroup>
                </Navbar.Form>
            </Fragment>
        );

        this.props.setMenuItems([header]);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        Reveal.removeEventListener('slidechanged');
        Reveal.removeEventListener('fragmentshown');
        Reveal.removeEventListener('fragmenthidden');
        Events.remove("menu-visibility", "slides");

    }

    componentDidMount() {
        super.componentDidMount();
        window.Reveal = Reveal;
        this.initReveal();

        Reveal.addEventListener( 'slidechanged', (event: SlideEvent ) => this.reportState());
        Reveal.addEventListener( 'fragmentshown', (event: SlideEvent ) => this.reportState());
        Reveal.addEventListener( 'fragmenthidden', (event: SlideEvent ) => this.reportState());
        Events.add("menu-visibility", "slides", this.handleMenuChange)
    }

    initReveal() {
        const state = this.getFromStorage(this.props.storageKey);
        Reveal.uninitialize();
        Reveal.initialize({
            transition: 'none', // none/fade/slide/convex/concave/zoom
            backgroundTransition: 'none', // none/fade/slide/convex/concave/zoom
            history: true,
            dependencies: [
                { src: 'plugin/notes/notes.js', async: true },
                { src: 'plugin/highlight/highlight.js', async: true }
            ],
            width: "100%",
            height: "100%",
            margin: 0,
            minScale: 1,
            maxScale: 1
        });

        if (state) {
            Reveal.slide( state.indexh, state.indexv, state.indexf);
        }
    }

    handleMenuChange = () => {
        this.initReveal();
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
