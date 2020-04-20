import React from 'react';
import Button from '../layout/components/CustomButtons/Button';
import { whiteColor } from '../layout/assets/jss/material-dashboard-react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    container: {
        margin: '0px 6px',
    },
    stepper: {
        width: '70px',
    },
    button: {
        backgroundColor: '#9d9d9d',
        fontSize: '15px',
    },
    label: {
        textTransform: "uppercase",
        color: whiteColor,
        fontSize: '12px',
        lineHeight: '.5em',
    },
    value: {
        fontSize: '15px',
        lineHeight: 1.42857143,
        padding: '12px 30px',
        background: '#535353',
        borderRadius: '3px',
        margin: ".3125rem 1px", // same as button
    }
}));

interface StepProps {
    label: string;
    step: number;
    value: number;
    setValue: (value: number) => void;
}

export default ({
    label,
    step,
    value,
    setValue,

}: StepProps) => {
    const classes = useStyles();

    const increaseValue = () => setValue(value + step);
    
    const decreaseValue = () =>  setValue(value - step);
    
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Typography className={classes.label}>
                    {label}
                </Typography>
            </Grid>
            <Grid item>
                <Button className={classes.button} onClick={decreaseValue}>&lt;</Button>
            </Grid>
            <Grid item>
                <Typography className={classes.value}>
                    {value}
                </Typography>
            </Grid>
            <Grid item>
                <Button className={classes.button} onClick={increaseValue}>&gt;</Button>
            </Grid>
        </Grid>
    );
}
