import React from 'react';
import React from 'react';
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import Card from "../layout/components/Card/Card.js";
import CardBody from '../layout/components/Card/CardBody';

export default function LobbyClosed() {

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardBody>
                
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}