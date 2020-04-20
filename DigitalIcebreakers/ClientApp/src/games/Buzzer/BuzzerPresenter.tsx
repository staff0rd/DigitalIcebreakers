import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ContentContainer from '../../components/ContentContainer';
import { useSelector } from '../../store/useSelector';

export default () => {
    const players = useSelector(state => state.games.buzzer);

    return (
        <ContentContainer header="Buzzer">
            <List component="nav">
                { players.map((p) => (
                    <ListItem
                        key={p.id}
                        button
                        selected={p.state === 'down'}
                    >
                        {p.name}
                    </ListItem>
                    ))}
            </List>
        </ContentContainer>
    );   
}
