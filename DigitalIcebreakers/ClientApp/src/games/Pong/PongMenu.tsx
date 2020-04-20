import React from "react";
import Button from '../../layout/components/CustomButtons/Button';
import Stepper from '../../components/Stepper';
import { resetScores, setPaddleHeight } from './PongReducer';
import { useDispatch } from "react-redux";
import { useSelector } from "../../store/useSelector";
import { ListItem } from "@material-ui/core";

export default () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.games.pong.presenter);
    return (
        <>
            <ListItem>
                <Button onClick={() => dispatch(resetScores())}>Reset score</Button> 
            </ListItem>
            <ListItem>
                <Stepper
                    label="Paddle height"
                    step={1} 
                    value={state.paddleHeight}
                    setValue={(value) => dispatch(setPaddleHeight(value))}
                />
            </ListItem>
            {/* <Stepper label="Paddle width" step={-5} value={this.state.paddleWidth} onChange={this.updatePaddleWidth} />
            <Stepper label="Paddle speed" step={25} value={this.state.paddleSpeed} onChange={this.updatePaddleSpeed} />
            <Stepper label="Ball speed" step={1} value={this.state.ballSpeed} onChange={this.updateBallSpeed} />*/}
        </>
    );
}