import React, { Component } from 'react';
import { Config } from '../config';
import { Changelog } from './Changelog';
import { Events } from '../Events';
var QRCode = require('qrcode.react');

interface Player {
    name: string;
    id: string;
}

interface LobbyProps {
    id: string;
    name: string;
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
                this.setState({qrCodeWidth: this.div.clientHeight - 80});
                console.log(`${this.div.clientWidth}, ${this.div.clientHeight}*`);
            }
            else {
                this.setState({qrCodeWidth: this.div.clientWidth - 80});
                console.log(`${this.div.clientWidth}*, ${this.div.clientHeight}`);
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
        const joinUrl = `${Config.baseUrl}/join/${this.props.id}`;
        //const players = (this.props.players || []).map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);
        if (this.props.id)
            return (
                <div ref={this.element} style={{height: "100%"}}>
                    <QRCode value={joinUrl} size={this.state.qrCodeWidth} renderAs="svg" style={{marginTop: '40', marginRight: '40', marginBottom: '40'}} />
                    {/* <h1>{this.props.name}</h1> */}

                    {/* <Row>
                        <Col md={12}>
                            <a href={joinUrl}>{joinUrl}</a>
                            <h2>Players</h2>
                            <ListGroup>
                                {players}
                            </ListGroup>
                        </Col>
                    </Row> */}
                </div>
            ); else return (
                <div>
                    <h1>Digital Icebreakers</h1>
                    <p>feature requests, suggestions, bugs & feedback to <a href="mailto:stafford@atqu.in">stafford@atqu.in</a></p>
                    <Changelog />
                </div>
            );
    }
}
