import React, { Component, Fragment } from 'react';
import { Col, Grid, Row, Glyphicon } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import Games from '../games/Games';
import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import { Events } from '../Events';
import { Colors, ColorUtils } from '../Colors';

type LayoutProps = RouteComponentProps & {
    currentGame?: string;
    isAdmin: boolean;
    menuItems: JSX.Element[];
    version: string;
    lobbyId?: string;
}

type LayoutState = {
    showMenu: boolean;
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
            const menu = this.state.showMenu ? this.getFullMenu(!!this.props.lobbyId) : this.getCollapsedMenu();
            
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
                    <NavMenu {...this.props} toggleMenu={this.toggleMenu} />
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
            color: ColorUtils.toHtml(Colors.BlueGrey.C500),
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

export default withRouter(Layout);
