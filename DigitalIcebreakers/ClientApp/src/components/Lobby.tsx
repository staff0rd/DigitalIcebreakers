import React, { useRef } from 'react';
import { Config } from '../config';
import { Changelog } from './Changelog';
import { GithubFork } from './GithubFork';
import { useSelector } from '../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';
var QRCode = require('qrcode.react');

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0, 0, 0, 5), 
        },
    },
    link: {
        textAlign: 'center',
        paddingBottom: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    players: {
        display: 'flex-inline',
        margin: theme.spacing(2, 0)
    },
    qrCode: {
        height: '100%',
        width: '100%',
    }
}));

export const Lobby = () => {
    const lobby = useSelector(state => state.lobby);

    if (lobby.id) {
        return <ActiveLobby />
    } else {
        return <NoLobby />;
    }
}

const ActiveLobby = () => {
    const classes = useStyles();
    const lobby = useSelector(state => state.lobby);
    const joinUrl = `${Config.baseUrl}/join/${lobby.id}`;
    
    return (
        <div className={classes.container}>
            <h1 className={classes.players}>
                Phone camera 👇
            </h1>
            <a href={joinUrl} className={classes.link}>
                
                    <QRCode
                        className={classes.qrCode}
                        value={joinUrl}
                        renderAs="svg"
                    />
                
            </a>
        </div>
    );
}

const NoLobby = () => {
    const imageStyle: React.CSSProperties = {
        maxHeight: '320px',
    };
    const imageContainer: React.CSSProperties = {
        backgroundColor: '#191919',
    };
    return (
        <>
            <GithubFork />
            <div>
                <div style={imageContainer} className='front-image-container'>
                    <img style={imageStyle} src='img/digital-icebreakers.jpg' className='img-responsive center-block' />
                </div>
                <h1>Digital Icebreakers</h1>
                <p>feature requests, suggestions, bugs & feedback to <a href="mailto:stafford@atqu.in">stafford@atqu.in</a></p>
                <h2>How it works</h2>
                <p>A presenter creates a Lobby and audience members join by pointing their phone cameras at the presenter's screen and scanning the QR code. The presenter can then guide the audience through games and experiences by clicking New Game.</p>
                <Changelog />
            </div>
        </>
    );
}