import React from 'react';
import UnknownIcon from '@material-ui/icons/Help';
import ConnectedIcon from '@material-ui/icons/Power';
import NotConnectedIcon from '@material-ui/icons/PowerOff';
import { useSelector } from '../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';
import { whiteColor, hexToRgb } from '../layout/assets/jss/material-dashboard-react';

const useStyles = makeStyles(theme => ({
    icon: {
        width: "24px",
        height: "30px",
        fontSize: "24px",
        lineHeight: "30px",
        float: "left",
        marginRight: "15px",
        textAlign: "center",
        verticalAlign: "middle",
        color: "#535353"
    }
}));

export default () => {
    const status = useSelector(state => state.connection.status);
    const classes = useStyles();

    switch (status) {
        case 0: return (<NotConnectedIcon className={classes.icon} />);
        case 1: return (<UnknownIcon className={classes.icon} />);
        case 2: return (<ConnectedIcon className={classes.icon} />);
        default: return <span></span>;
    };
};
