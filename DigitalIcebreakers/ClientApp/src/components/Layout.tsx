import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import Games from '../games/Games';
import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import { Events } from '../Events';

type LayoutProps = RouteComponentProps & {
    currentGame: string;
    isAdmin: boolean;
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
                <Col sm={3}>
                    <NavMenu {...this.props} toggleMenu={this.toggleMenu} />
                </Col>
                <Col className="full-height" sm={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }

    getCollapsedMenu() {
        return (
            <Row className="full-height"> 
                <Col className="full-height" sm={12}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

export default withRouter(Layout);
