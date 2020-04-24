import React from 'react';
import Games from '../games/Games';
import { startNewGame } from '../store/lobby/actions';
import { useDispatch } from 'react-redux';
import ContentContainer from './ContentContainer';
import Card from '../layout/components/Card/Card';
import CardFooter from '../layout/components/Card/CardFooter';
import CardBody from '../layout/components/Card/CardBody';
import CardHeader from '../layout/components/Card/CardHeader';
import CardIcon from '../layout/components/Card/CardIcon';
import GridContainer from '../layout/components/Grid/GridContainer';
import GridItem from '../layout/components/Grid/GridItem';
import FiberNew from '@material-ui/icons/FiberNew'

import { makeStyles } from '@material-ui/core/styles';
import { grayColor } from '../layout/assets/jss/material-dashboard-react';
import Button from "../layout/components/CustomButtons/Button";
import CardTitle from '../layout/components/Card/CardTitle';

const useStyles = makeStyles(theme => ({
    cardCategory: {
        color: grayColor[0],
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        paddingTop: "10px",
        marginBottom: "0"
      },
      cardTitle: {
        color: grayColor[2],
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: 300,
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
          color: grayColor[1],
          fontWeight: 400,
          lineHeight: 1
        },
      },
      icon: {
          display: 'flex',
          position: 'absolute',
          right: 0,
          width: '24px',
      },
}));

export default () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const newGame = (name: string) => {
        dispatch(startNewGame(name));
    }

    return (
        <ContentContainer>
            <h2>New game</h2>
            <GridContainer>
                { Games.map(g => (
                    <GridItem xs={12} sm={12} md={4}>
                        <Card>
                            { g.isNew && (
                                <CardIcon className={classes.icon} color="info">
                                    <FiberNew />
                                </CardIcon>
                            )}
                            <CardBody>
                                <h2 className={classes.cardTitle}>
                                    {g.title}
                                </h2>
                                <p className={classes.cardCategory}>
                                    {g.description}
                                </p>
                            </CardBody>
                            <CardFooter chart>
                            <div>
                                <Button color="primary" onClick={() => newGame(g.name)}>Play</Button>
                            </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                ))}
            </GridContainer>
        </ContentContainer>
    );
}
