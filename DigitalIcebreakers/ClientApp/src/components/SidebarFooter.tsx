import React from "react";
import ConnectionIcon from './ConnectionIcon';
import { Config } from '../config'
import { makeStyles } from '@material-ui/core/styles';
import { whiteColor, defaultFont } from '../layout/assets/jss/material-dashboard-react';
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles((theme) => ({
    sidebarFooter: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
        padding: '15px 30px',
        opacity: .25,
    },
    text: {
        ...defaultFont as CSSProperties,
        margin: "0",
        lineHeight: '30px',
        fontSize: '14px',
        color: whiteColor,
    },
}));

export default () => {
    const classes = useStyles();
    return (
        <div className={classes.sidebarFooter}>
            <ConnectionIcon />
            <div className={classes.text}>{`v${Config.version}`}</div>
        </div>
    );
}