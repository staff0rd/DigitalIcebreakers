import React from 'react';
import { Config } from '../config';
import { useSelector } from '../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';

const useStylesLg = makeStyles((theme) => ({
    container: {
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    header: {
        display: 'flex-inline',
        margin: theme.spacing(2, 0)
    },
    link: {
        textAlign: 'center',
        paddingBottom: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    qrCode: {
        height: '100%',
        width: '100%',
    }
}));

const useStylesSm = makeStyles((theme) => ({
    container: {
        textAlign: 'center',
        padding: '10px 10px 4px 10px',
        background: 'white',
        margin: 15,
    },
    header: {},
    link: {
        textAlign: 'center',
        height: '100%',
    },
    qrCode: {
        height: '100%',
        width: '100%',
    }
}));

var QRCode = require('qrcode.react');

type Props = {
    lg?: boolean
}

export default ({ lg }: Props) => {
    const classes = lg ? useStylesLg() : useStylesSm();
    const lobby = useSelector(state => state.lobby);
    const joinUrl = `${Config.baseUrl}/join/${lobby.id}`;
    return (<div className={classes.container}>
        { lg && (
            <h1 className={classes.header}>
                Phone camera 👇
            </h1>
        )}
        <a href={joinUrl} className={classes.link}>
            <QRCode className={classes.qrCode} value={joinUrl} renderAs="svg" />
        </a>
    </div>);
};
