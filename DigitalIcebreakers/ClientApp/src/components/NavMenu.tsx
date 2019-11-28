import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';
import { Config } from '../config';
import { NavSubMenu } from './NavSubMenu'
import Games, { IGame } from '../games/Games';
import { DynamicSizedQrCode } from './DynamicSizedQrCode';
import { ConnectionIcon } from './ConnectionIcon';
import { useSelector } from '../store/useSelector';
import { useDispatch } from 'react-redux';
import { toggleMenu } from '../store/shell/actions';
import { useHistory } from 'react-router-dom';

export const NavMenu: React.FC = () => {
    const lobby = useSelector(state => state.lobby);
    const dispatch = useDispatch();
    const qrCodeWidthFunction = () => window.innerWidth / 4 - 60;
    const qrCodeParent = useRef<HTMLDivElement>(null);
    const joinUrl = `${Config.baseUrl}/join/${lobby.id}`;
    const menuItems = useSelector(state => state.shell.menuItems);
    const version = useSelector(state => state.shell.version);

    const createLobby = (
        <LinkContainer to={'/createLobby'}>
            <NavItem>
                <Glyphicon glyph='plus' /> Host
            </NavItem>
        </LinkContainer>);

    const lobbyLink = (
        <LinkContainer to={'/'} exact>
            <NavItem>
                <Glyphicon glyph='home' /> Lobby
          </NavItem>
        </LinkContainer>
    );

    const closeLobby = (
        <LinkContainer to={'/closeLobby'}>
            <NavItem>
                <Glyphicon glyph='remove' /> Close Lobby
            </NavItem>
        </LinkContainer>
    );

    const startGame = (
        <LinkContainer to={'/newGame'}>
            <NavItem>
                <Glyphicon glyph='play' /> New game
            </NavItem>
        </LinkContainer>
    );

    const collapseNav = (
        <NavItem eventKey={1} onClick={() => dispatch(toggleMenu(false))}>
            <Glyphicon glyph='circle-arrow-left' />Hide Menu
        </NavItem>
    );

    const gameName = Games()
        .filter((game: any) => game.name === lobby.currentGame)
        .map((game: IGame) => game.title);

    const currentGame = (
        <LinkContainer to={`/game/${lobby.currentGame}`} exact>
            <NavItem>
                <Glyphicon glyph='king' /> {gameName}
            </NavItem>
        </LinkContainer>
    );

    const qrCode = (
        <NavItem>
            <div ref={qrCodeParent}>
                <DynamicSizedQrCode joinUrl={joinUrl} qrCodeStyle={{}} parent={qrCodeParent} widthFunction={qrCodeWidthFunction} />
            </div>
        </NavItem>
    );

    const history = useHistory();

    const isGameScreen = history.location.pathname === `/game/${lobby.currentGame}`;
    const isLobby = history.location.pathname === `/`

    const subMenu = !isGameScreen ? "" : (
        <NavSubMenu menuItems={menuItems} />
    );

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
                    {lobby.id && !isLobby ? qrCode : ""}
                    {lobby.id ? "" : createLobby}
                    {lobby.id ? lobbyLink : ""}
                    {lobby.id && lobby.currentGame ? currentGame : ""}
                    {subMenu}
                    {lobby.id && lobby.isAdmin ? startGame : ""}
                    {lobby.currentGame && lobby.isAdmin && !isLobby ? collapseNav : ""}
                    {lobby.id && lobby.isAdmin ? closeLobby : ""}
                    <NavItem disabled={true}>
                        <ConnectionIcon /> Connection - v{version}
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
    
}