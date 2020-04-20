import React, { Fragment } from "react";
import Button from '../../layout/components/CustomButtons/Button';
import Stepper from '../../components/Stepper';
import { resetScores } from './PongReducer';
import { useDispatch } from "react-redux";

export default () => {
    const dispatch = useDispatch();
    return (
        <Fragment>
            {/* <Stepper label="Paddle height" step={1} value={this.state.paddleHeight} onChange={this.updatePaddleHeight} />
            <Stepper label="Paddle width" step={-5} value={this.state.paddleWidth} onChange={this.updatePaddleWidth} />
            <Stepper label="Paddle speed" step={25} value={this.state.paddleSpeed} onChange={this.updatePaddleSpeed} />
            <Stepper label="Ball speed" step={1} value={this.state.ballSpeed} onChange={this.updateBallSpeed} />*/}
            <Button onClick={() => dispatch(resetScores())}>Reset score</Button> 
        </Fragment>
    );
}