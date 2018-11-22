import React from 'react';

export const UserContext = React.createContext({
    name: "test",
    id: undefined,
    lobbyId: undefined,
    isAdmin: false,
    setLobbyId: (id, isAdmin) => { }
});