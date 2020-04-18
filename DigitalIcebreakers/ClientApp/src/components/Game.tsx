import React from 'react';
import Games from '../games/Games';
import { useParams } from 'react-router-dom'
import { useSelector } from '../store/useSelector';

export const Game =  () => {
    let { name } = useParams();
    const game = Games.filter(g => g.name === name)[0];
    const isAdmin = useSelector(state => state.lobby.isAdmin); 
    
    if (!game)
        return <div>No such game</div>;
    else
        return (
            <div>
                {isAdmin ? game.presenter : game.client}
            </div>
        );
}
