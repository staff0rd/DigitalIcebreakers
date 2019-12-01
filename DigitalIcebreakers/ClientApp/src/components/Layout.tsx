import React, { Component, Fragment } from 'react';
import { Col, Grid, Row, Glyphicon } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import Games from '../games/Games';
import { withRouter, BrowserRouterProps } from 'react-router-dom';
import {RouteComponentProps, Redirect, Route} from "react-router";
import { Events } from '../Events';
import { Colors } from '../Colors';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import history from '../history'
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ConnectionStatus } from '../ConnectionStatus';
import { NewGame } from './NewGame';
import { Game } from './Game';
import { CloseLobby } from './CloseLobby';
import { Join } from './Join';
import { Lobby } from './Lobby';
import { CreateLobby } from './CreateLobby';
import { LobbyClosed } from './LobbyClosed';

type LayoutProps = RouteComponentProps & {
    currentGame?: string;
    isAdmin: boolean;
    connected: ConnectionStatus;
}

type LayoutState = {
    showMenu: boolean;
}


class DebugRouter extends Router {
  constructor(props: BrowserRouterProps){
    super(props);
    console.log('initial history is: ', JSON.stringify(history, null,2))
    history.listen((location: any, action: any)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(history, null,2));
    });
  }
}

class Layout extends Component<LayoutProps, LayoutState> {
    displayName = Layout.name

    constructor(props: LayoutProps) {
        super(props);
        this.state = {
            showMenu: true
        };
    }

    componentDidMount() {
        const isLobby = this.props.history.location.pathname === `/`;
        if (isLobby && !this.state.showMenu) {
            this.setState({showMenu: true});
        }
    }

    toggleMenu = (show: boolean) => {
        this.setState({showMenu: show});
        Events.emit("menu-visibility")
    }

    render() {
        let fullscreen = false;
        if (this.props.currentGame && this.props.location.pathname.indexOf('game/') !== -1) {
            const game = Games(undefined).filter(p => p.name === this.props.currentGame)[0];
            if (game && game.fullscreen && !this.props.isAdmin)
                fullscreen = true;
        }
        if (fullscreen)
            return this.props.children;
        else
        {
            const menu = this.state.showMenu ? this.getFullMenu() : this.getCollapsedMenu();
            
            return (
                <Grid fluid className="navPad">
                    { menu }
                </Grid>
            );
        }
    }

    getFullMenu() {
        return (
            <Row className="full-height"> 
                <Col style={this.columnStyle} sm={3}>
                    <NavMenu {...this.props} />
                </Col>
                <Col style={this.columnStyle} className="full-height" sm={9}>       
                    {this.props.children}
                </Col>
            </Row>
        );
    }

    private columnStyle: React.CSSProperties = {
        padding: 0
    }

    getCollapsedMenu() {
        const iconStyle: React.CSSProperties = {
            float:"right",
            position: "absolute",
            margin: 0,
            right: 5,
            top: 5,
            fontSize: "50px",
            color: Colors.toHtml(Colors.BlueGrey.C500),
            opacity: .25,
            cursor: "pointer"
        }
        
        return (
            <Fragment>
                <Row className="full-height"> 
                    <Col style={this.columnStyle} className="full-height" sm={12}>
                        {this.props.children}
                    </Col>
                </Row>
                <Glyphicon style={iconStyle} glyph="menu-hamburger" onClick={() => this.toggleMenu(true)} />
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => { return {
    currentGame: state.lobby.currentGame,
    isAdmin: state.lobby.isAdmin,
    connected: state.connection.status
}}

const mapDispatchToProps = {};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout as any)); //TODO: type any
