import React from 'react';
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import Card from "../layout/components/Card/Card.js";
import CardBody from '../layout/components/Card/CardBody';
import CardTitle from '../layout/components/Card/CardTitle';
import ContentContainer from './ContentContainer';

export default () => {
  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle title='Lobby closed' subTitle='Thanks for playing' />
            <CardBody>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
}