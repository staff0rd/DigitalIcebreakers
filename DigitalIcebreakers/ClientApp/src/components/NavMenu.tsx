import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';
import { Config } from '../config';
import { NavSubMenu } from './NavSubMenu'
import Games, { IGame } from '../games/Games';
import { History } from 'history';
import { DynamicSizedQrCode } from './DynamicSizedQrCode';
import { ConnectionIcon } from './ConnectionIcon';

type NavMenuProps = {
    lobbyId?: string;
    toggleMenu: (show: boolean) => void;
    currentGame?: string;
    isAdmin: boolean;
    history: History;
    menuItems: JSX.Element[];
    version: string;
}

export const NavMenu: React.FC<NavMenuProps> = (props) => {
    const qrCodeWidthFunction = () => window.innerWidth / 4 - 60;
    const qrCodeParent = useRef<HTMLDivElement>(null);
    const joinUrl = `${Config.baseUrl}/join/${props.lobbyId}`;

    const createLobby = (
        <LinkContainer to={'/createLobby'}>
            <NavItem>
                <Glyphicon glyph='plus' /> Host
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
        <NavItem eventKey={1} onClick={() => props.toggleMenu(false)}>
            <Glyphicon glyph='circle-arrow-left' />Hide Menu
        </NavItem>
    );

    const gameName = Games(props)
        .filter((game: any) => game.name === props.currentGame)
        .map((game: IGame) => game.title);

    const currentGame = (
        <LinkContainer to={`/game/${props.currentGame}`} exact>
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

    const isGameScreen = props.history.location.pathname === `/game/${props.currentGame}`;
    const isLobby = props.history.location.pathname === `/`

    const subMenu = !isGameScreen ? "" : (
        <NavSubMenu menuItems={props.menuItems} />
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
                    {props.lobbyId && !isLobby ? qrCode : ""}
                    {props.lobbyId ? "" : createLobby}
                    {props.lobbyId ? lobby : ""}
                    {props.lobbyId && props.currentGame ? currentGame : ""}
                    {subMenu}
                    {props.lobbyId && props.isAdmin ? startGame : ""}
                    {props.currentGame && props.isAdmin && !isLobby ? collapseNav : ""}
                    {props.lobbyId && props.isAdmin ? closeLobby : ""}
                    <NavItem disabled={true}>
                        <ConnectionIcon /> Connection - v{props.version}
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
    
}