import React from 'react';
import Games from '../games/Games';
import { useSelector } from '../store/useSelector';

export default () => {
    const name = useSelector(state => state.lobby.currentGame);
    const game = Games.find(g => g.name === name);
    const isAdmin = useSelector(state => state.lobby.isAdmin); 
    const Component = isAdmin ? game!.presenter : game!.client as any;
    
    if (!game)
        return <div>No game</div>;
    else
        return <Component />;
}
