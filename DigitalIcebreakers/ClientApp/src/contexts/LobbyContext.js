import React from 'react';

export const LobbyContext = React.createContext({
    name: undefined,
    id: undefined,
    players: [],
    isAdmin: false,
    currentGame: undefined,
    connection: undefined,
    createLobby: (name) => { }
});