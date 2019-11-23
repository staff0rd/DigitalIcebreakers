import React, { Component, useState, useRef, useEffect } from 'react';
import { Config } from '../config';
import { Changelog } from './Changelog';
import { Events } from '../Events';
import { Player } from './Player';
var QRCode = require('qrcode.react');

interface AppLobby {
    id: string;
    name: string;
}

interface LobbySwitchProps {
    lobby?: AppLobby;
    players: Player[];
}

interface LobbyProps {
    lobby: AppLobby;
    players: Player[];
}

export const LobbySwitch: React.FC<LobbySwitchProps> = (props) => {
    if (props.lobby) {
        return <Lobby lobby={props.lobby} players={props.players} />
    } else {
        return <NoLobby />;
    }
}

const Lobby: React.FC<LobbyProps> = (props) => {
    const [qrCodeWidth, setQrCodeWidth] = useState<number>(256);
    const qrCodeStyle: React.CSSProperties = {marginTop: '0', marginRight: '40', marginBottom: '40'}
    const joinUrl = `${Config.baseUrl}/join/${props.lobby.id}`;
    const element = useRef<HTMLDivElement>(null);

    const resize = () => {
        if (element.current) {
            if (element.current.clientWidth > element.current.clientHeight) {
                setQrCodeWidth(element.current.clientHeight - 100);
            }
            else {
                setQrCodeWidth(element.current.clientWidth - 100);
            }
        }
    }

    useEffect(() => {
        resize();
    }, [element.current]);

    useEffect(() => {
        Events.add('onresize', 'qrcode', resize);
        return () => Events.remove('onresize', 'qrcode');
    });

    return (
        <div ref={element} style={{height: "100%"}}>
            <a href={joinUrl}>{joinUrl}</a>
            <h1 style={{marginTop: 0}}>Players: {props.players.length}</h1>
            <QRCode value={joinUrl} size={qrCodeWidth} renderAs="svg" style={qrCodeStyle} />
        </div>
    );
}

const NoLobby = () => {
    return (
        <div>
            <h1>Digital Icebreakers</h1>
            <p>feature requests, suggestions, bugs & feedback to <a href="mailto:stafford@atqu.in">stafford@atqu.in</a></p>
            <Changelog />
        </div>
    );
}