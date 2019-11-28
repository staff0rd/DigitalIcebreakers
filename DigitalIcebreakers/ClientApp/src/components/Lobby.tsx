import React, { useRef } from 'react';
import { Config } from '../config';
import { Changelog } from './Changelog';
import { DynamicSizedQrCode } from './DynamicSizedQrCode';
import { GithubFork } from './GithubFork';
import { useSelector } from '../store/useSelector';
export const Lobby = () => {
    const lobby = useSelector(state => state.lobby);

    if (lobby.id) {
        return <ActiveLobby />
    } else {
        return <NoLobby />;
    }
}

const ActiveLobby = () => {
    const lobby = useSelector(state => state.lobby);
    const qrCodeStyle: React.CSSProperties = {marginTop: '0', marginRight: '40', marginBottom: '40'}
    const joinUrl = `${Config.baseUrl}/join/${lobby.id}`;
    const qrCodeParent = useRef<HTMLDivElement>(null);

    return (
        <div ref={qrCodeParent} style={{height: "100%"}}>
            <a href={joinUrl}>{joinUrl}</a>
            <h1 style={{marginTop: 0}}>Players: {lobby.players.length}</h1>
            <DynamicSizedQrCode joinUrl={joinUrl} qrCodeStyle={qrCodeStyle} parent={qrCodeParent} />
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