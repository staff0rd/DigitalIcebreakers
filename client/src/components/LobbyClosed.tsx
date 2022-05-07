import React from "react";
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer";
import Card from "../layout/components/Card/Card";
import CardBody from "../layout/components/Card/CardBody";
import CardTitle from "../layout/components/Card/CardTitle";
import { ContentContainer } from "./ContentContainer";
import CardFooter from "../layout/components/Card/CardFooter";
import Button from "../layout/components/CustomButtons/Button";
import { useHistory } from "react-router";

const LobbyClosed = () => {
  const history = useHistory();
  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle
              title="Lobby closed"
              subTitle="This lobby could not be found"
            />
            <CardBody></CardBody>
            <CardFooter>
              <Button onClick={() => history.push("/join-lobby")}>
                Join Another
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
};
export default LobbyClosed;
