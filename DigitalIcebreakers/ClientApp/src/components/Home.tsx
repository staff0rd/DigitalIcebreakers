import React from 'react';
import { Changelog } from './Changelog';
import GithubFork from './GithubFork';
import { makeStyles } from '@material-ui/core/styles';
import ContentContainer from './ContentContainer';

const useStyles = makeStyles(theme => ({
    imageContainer: {
        backgroundColor: '#191919',
        textAlign: 'center',
    },
    image: {
        maxHeight: '320px',
    },
}));

export default () => {
    const classes = useStyles();
    return (
        <>
            <GithubFork />
            <div className={classes.imageContainer}>
                <img className={classes.image} alt='Digital Icebreakers' src='img/digital-icebreakers.jpg' />
            </div>
            <ContentContainer>
                <p>Feature requests, suggestions, bugs & feedback to <a href="mailto:stafford@atqu.in">stafford@atqu.in</a></p>
                <h2>How it works</h2>
                <p>A presenter creates a Lobby and audience members join by pointing their phone cameras at the presenter's screen and scanning the QR code. The presenter can then guide the audience through games and experiences by clicking New Game.</p>
                <Changelog />
            </ContentContainer>
        </>
    );
};
