import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';
import { LobbyContext } from '../contexts/LobbyContext';

export class NavMenu extends Component {
  displayName = NavMenu.name

    render() {
        const createLobby = (
            <LinkContainer to={'/createLobby'}>
                <NavItem>
                    <Glyphicon glyph='plus' /> Create Lobby
                </NavItem>
            </LinkContainer>);

        const lobby = (
            <LinkContainer to={'/'} exact>
                <NavItem>
                    <Glyphicon glyph='home' /> Lobby
              </NavItem>
            </LinkContainer>
        );

        const closeLobby = (
            <LinkContainer to={'/closeLobby'}>
                <NavItem>
                    <Glyphicon glyph='minus' /> Close Lobby
                </NavItem>
            </LinkContainer>
        );

        const startGame = (
            <LinkContainer to={'/newGame'}>
                <NavItem>
                    <Glyphicon glyph='minus' /> New game
                </NavItem>
            </LinkContainer>
        );

        const stopGame = (
            <LinkContainer to={'/'} exact>
                <NavItem>
                    <Glyphicon glyph='minus' /> New game
                </NavItem>
            </LinkContainer>
        );

        let gameStopStart;

        if (this.context.id) {
            gameStopStart = this.context.currentGame ? stopGame : startGame;
        }

        return (
            <Navbar inverse fixedTop fluid collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to={'/'}>Digital Icebreakers</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        {this.context.id ? "" : createLobby}
                        {this.context.id ? lobby : ""}
                        {this.context.id ? closeLobby : ""}
                        {this.context.id ? gameStopStart : ""}

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
  }
}
NavMenu.contextType = LobbyContext;

