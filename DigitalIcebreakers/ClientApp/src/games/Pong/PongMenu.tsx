import React from "react";
import Button from '../../layout/components/CustomButtons/Button';
import Stepper from '../../components/Stepper';
import { resetScores, setPaddleHeight, setPaddleWidth, setPaddleSpeed, setBallSpeed } from './PongReducer';
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
                    setValue={(value) => dispatch(setPaddleHeight(value))} />
            </ListItem>
            <ListItem>
                <Stepper
                    label="Paddle width"
                    step={-5}
                    value={state.paddleWidth}
                    setValue={(value) => dispatch(setPaddleWidth(value))} />
            </ListItem>
            <ListItem>
                <Stepper
                    label="Paddle speed"
                    step={25}
                    value={state.paddleSpeed}
                    setValue={(value) => dispatch(setPaddleSpeed(value))} />
            </ListItem>
            <ListItem>
                <Stepper
                label="Ball speed"
                step={1}
                value={state.ballSpeed}
                setValue={(value) => dispatch(setBallSpeed(value))} />    
            </ListItem>
        </>
    );
}