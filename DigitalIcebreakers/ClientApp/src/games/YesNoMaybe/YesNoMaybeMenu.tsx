import React from 'react';
import Button from '../../layout/components/CustomButtons/Button';
import { useDispatch } from 'react-redux';
import { adminMessage } from '../../store/lobby/actions';
import ListItem from '@material-ui/core/ListItem';

export const YesNoMaybeMenu = () => {
    const dispatch = useDispatch();
    const reset = () => {
        dispatch(adminMessage("reset"));
    };
    return (
        <ListItem>
            <Button onClick={reset}>Reset</Button>
        </ListItem>
    );
};
