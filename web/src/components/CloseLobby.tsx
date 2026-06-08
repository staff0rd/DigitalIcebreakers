import Button from "../layout/components/CustomButtons/Button";
import { useSetAtom } from "jotai";
import { closeLobbyAtom } from "../store/jotai/transportAtoms";
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer";
import Card from "../layout/components/Card/Card";
import CardFooter from "../layout/components/Card/CardFooter";
import CardTitle from "../layout/components/Card/CardTitle";
import { ContentContainer } from "./ContentContainer";

export default function CloseLobby() {
  const closeLobby = useSetAtom(closeLobbyAtom);

  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle
              title="Close Lobby"
              subTitle="Closing the lobby will disconnect all players"
            />
            <CardFooter>
              <Button color="primary" onClick={() => closeLobby()}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
}
