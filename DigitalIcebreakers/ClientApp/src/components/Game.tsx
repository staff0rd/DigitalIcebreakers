import React from 'react';
import Games from '../games/Games';
import {RouteComponentProps } from 'react-router'
import { useSelector } from '../store/useSelector';

type RouteParams = {
    name: string
}

export const Game: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    
    const game = Games().filter(g => g.name === props.match.params.name)[0];
    
    if (!game)
        return <div>No such game</div>;
    
    const isAdmin = useSelector(state => state.lobby.isAdmin); 

    return (
        <div className="full-height">
            {isAdmin ? game.presenter : game.client}
        </div>
    );
}
