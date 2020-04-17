import React, { ReactNode } from 'react';
import Button from "../layout/components/CustomButtons/Button";
import { useDispatch } from 'react-redux';
import { closeLobby } from '../store/lobby/actions';
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import Card from "../layout/components/Card/Card.js";
import CardFooter from "../layout/components/Card/CardFooter.js";
import CardTitle from '../layout/components/Card/CardTitle';
import ContentContainer from './ContentContainer';

export default function CloseLobby() {
  const dispatch = useDispatch();

  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle title="Close Lobby" subTitle="Closing the lobby will disconnect all players" />
            <CardFooter>
              <Button color="primary" onClick={() => dispatch(closeLobby())}>Close</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
}