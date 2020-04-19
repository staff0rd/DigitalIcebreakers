import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { BaseGame, BaseGameProps } from '../BaseGame'
import { connect, ConnectedProps } from 'react-redux';
import { setGameMessageCallback } from '../../store/connection/actions';
import { GameMessage } from '../GameMessage';
import ContentContainer from '../../components/ContentContainer';

const connector = connect(
    null,
    { setGameMessageCallback }
);
  
type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

interface Player {
    id: string;
    name: string;
    state: string;
}

interface BuzzerState {
    players: Player[];
}

class BuzzerPresenter extends BaseGame<PropsFromRedux, BuzzerState> {
    constructor(props: PropsFromRedux) {
        super(props);

        this.state = {
            players: []
        };
    }

    componentDidMount() {
        this.props.setGameMessageCallback(({ id, name, payload }: GameMessage<string>) => {
            var user = {
                id: id,
                name: name,
                state: payload
            };

            this.setState(prevState => {
                const players = prevState.players.map((p: Player) => p);
                if (!players.filter((p:Player) => p.id === user.id).length) {
                    players.push(user);
                }
                players.forEach((p: Player) => {
                    if (p.id === user.id)
                        p.state = user.state;
                });
                return { players: players };
            });
        });
    }

    render() {
        return (
            <ContentContainer header="Buzzer">
                <List component="nav">
                    { (this.state.players || []).map((p, ix) => (
                        <ListItem
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
}

export default connector(BuzzerPresenter);
