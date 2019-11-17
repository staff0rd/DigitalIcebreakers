import React, { Component } from 'react';
import { Config } from '../config';
import { Changelog } from './Changelog';
import { Events } from '../Events';
import { Player } from './Player';
var QRCode = require('qrcode.react');

interface AppLobby {
    id: string;
    name: string;
}

interface LobbyProps {
    lobby?: AppLobby;
    players: Player[];
}

interface LobbyState {
    qrCodeWidth: number;
}

export class Lobby extends Component<LobbyProps, LobbyState> {
    displayName = Lobby.name

    div?: HTMLDivElement;

    constructor(props: LobbyProps) {
        super(props);
        this.state = {
            qrCodeWidth: 256
        };
    }
    
    element = (e: HTMLDivElement) => {
        var firstAssigned = !this.div;
        this.div = e;      
        firstAssigned && this.resize();
    }

    resize = () => {
        if (this.div) {
            if (this.div.clientWidth > this.div.clientHeight) {
                this.setState({qrCodeWidth: this.div.clientHeight - 100});
            }
            else {
                this.setState({qrCodeWidth: this.div.clientWidth - 80});
            }
        }
    }

    componentDidMount() {
        console.log('component did mount');
        this.resize();
        Events.add('onresize', 'qrcode', this.resize);
    }

    componentWillUnmount() {
        Events.remove('onresize', 'qrcode');
    }

    render() {
        const qrCodeStyle: React.CSSProperties = {marginTop: '0', marginRight: '40', marginBottom: '40'}
        //const players = (this.props.players || []).map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);
        if (this.props.lobby) {
        const joinUrl = `${Config.baseUrl}/join/${this.props.lobby.id}`;
            return (
                <div ref={this.element} style={{height: "100%"}}>
                    <a href={joinUrl}>{joinUrl}</a>
                    <h1 style={{marginTop: 0}}>Players: {this.props.players.length}</h1>
                    <QRCode value={joinUrl} size={this.state.qrCodeWidth} renderAs="svg" style={qrCodeStyle} />
                </div>
            );
         } else return (
                <div>
                    <h1>Digital Icebreakers</h1>
                    <p>feature requests, suggestions, bugs & feedback to <a href="mailto:stafford@atqu.in">stafford@atqu.in</a></p>
                    <Changelog />
                </div>
            );
    }
}
