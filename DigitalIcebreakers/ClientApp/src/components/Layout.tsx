import React, { Component, Fragment } from 'react';
import { Col, Grid, Row, Glyphicon } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import Games from '../games/Games';
import { withRouter, BrowserRouterProps } from 'react-router-dom';
import {RouteComponentProps, Redirect, Route} from "react-router";
import { Events } from '../Events';
import { Colors, ColorUtils } from '../Colors';
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
import { LobbyClosed } from './LobbyClosed';
import { toggleMenu } from '../store/shell/actions'

type LayoutProps = RouteComponentProps & {
    currentGame?: string;
    isAdmin: boolean;
    connected: ConnectionStatus;
    lobbyId?: string;
    showMenu: boolean;
    toggleMenu: (show: boolean) => void;
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

class Layout extends Component<LayoutProps, {}> {
    displayName = Layout.name

    constructor(props: LayoutProps) {
        super(props);
        this.state = {
            showMenu: true
        };
    }

    componentDidMount() {
        const isLobby = this.props.history.location.pathname === `/`;
        if (isLobby && !this.props.showMenu) {
            this.setState({showMenu: true});
        }
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
            const hasLobby = !!this.props.lobbyId;
            const menu = this.props.showMenu ? this.getFullMenu(hasLobby) : this.getCollapsedMenu(hasLobby);
            
            return (
                <Grid fluid className="navPad">
                    { menu }
                </Grid>
            );
        }
    }

    getFullMenu(hasLobby: boolean) {
        const className = hasLobby ? "full-height" : "";
        return (
            <Row className={className}> 
                <Col style={this.columnStyle} sm={3}>
                    <NavMenu {...this.props} />
                </Col>
                <Col style={this.columnStyle} className={className} sm={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }

    private columnStyle: React.CSSProperties = {
        padding: 0
    }

    getCollapsedMenu(hasLobby: boolean) {
        const iconStyle: React.CSSProperties = {
            float:"right",
            position: "absolute",
            margin: 0,
            right: 5,
            top: 5,
            fontSize: "50px",
            color: ColorUtils.toHtml(Colors.BlueGrey.C500),
            opacity: .25,
            cursor: "pointer"
        }
        const className = hasLobby ? "full-height" : "";
        return (
            <Fragment>
                <Row className={className}> 
                    <Col style={this.columnStyle} className={className} sm={12}>
                        {this.props.children}
                    </Col>
                </Row>
                <Glyphicon style={iconStyle} glyph="menu-hamburger" onClick={() => this.props.toggleMenu(true)} />
            </Fragment>
        );
    }
}

const mapStateToProps = (state: RootState) => { return {
    currentGame: state.lobby.currentGame,
    isAdmin: state.lobby.isAdmin,
    connected: state.connection.status,
    lobbyId: state.lobby.id,
    showMenu: state.shell.showMenu,
}}

const mapDispatchToProps = {
    toggleMenu
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout as any)); //TODO: type any
