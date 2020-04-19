import React, { Fragment, useState, useEffect } from 'react';
import { Button, Navbar, FormGroup } from 'react-bootstrap';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import { Pixi } from '../pixi/Pixi';
import { useDispatch } from 'react-redux';
import { adminMessage } from '../../store/lobby/actions';
import { setGameMessageCallback } from '../../store/connection/actions';
import { setMenuItems } from '../../store/shell/actions';
import { GameMessage } from '../GameMessage';
import { useResizeListener } from '../pixi/useResizeListener';

interface YesNoMaybeState {
    yes: number;
    no: number;
    maybe: number;
}
  
export default () => {
    const dispatch = useDispatch();
    const [pixi, setPixi] = useState<PIXI.Application>();
    const [state, setState] = useState({
        yes: 0,
        no: 0,
        maybe: 0
    });

    const init = (app?: PIXI.Application) => {
        if (app) {
            console.log('!!!!!!!!!! SET PIXI');
            setPixi(app);
        }
    };
      
    useEffect(() => {
        dispatch(setGameMessageCallback(({ payload }: GameMessage<YesNoMaybeState>) => {
            setState(payload);
        }));
        const header = (
            <Fragment>
                <Navbar.Form>
                    <FormGroup>
                        <Button bsStyle="primary" onClick={reset}>Reset</Button>
                    </FormGroup>
                </Navbar.Form>
            </Fragment>
        );
        dispatch(setMenuItems([header]));
    }, []);

    const resize = () => {
        const data = [
            {label: "Yes", value: state.yes, color: Colors.Red.C500},
            {label: "No", value: state.no, color: Colors.Blue.C500},
            {label: "Maybe", value: state.maybe, color: Colors.Grey.C500}
        ]
        if (pixi) {
            pixi.stage.removeChildren();
            new Graph(pixi, data)
        } else {
            console.log('no pixi');
        }
    } 
    
    const reset = () => {
        dispatch(adminMessage("reset"));
    }

    useResizeListener(resize);
    useEffect(() => resize(), [pixi, state]);
    
    return <Pixi backgroundColor={0xFFFFFF} onAppChange={(app) => init(app)} />
}