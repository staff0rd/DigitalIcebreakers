import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clientMessage } from "../../store/lobby/actions";
import { ContentContainer } from "../../components/ContentContainer";
import Grid from "@material-ui/core/Grid";
import Card from "../../layout/components/Card/Card";
import CardFooter from "../../layout/components/Card/CardFooter";
import Button from "../../layout/components/CustomButtons/Button";
import { IdeaEntry } from "../shared/IdeaEntry";

export const IdeaWallClient = () => {
  const dispatch = useDispatch();
  const [idea, setIdea] = useState<string>("");

  const onClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (idea.length) {
      dispatch(clientMessage(idea));
      setIdea("");
    }
  };

  return (
    <ContentContainer>
      <Grid container>
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <IdeaEntry
              idea={idea}
              setIdea={setIdea}
              maxCharacters={50}
              maxLines={4}
            />
            <CardFooter>
              <Button color="primary" onClick={onClick}>
                Send
              </Button>
            </CardFooter>
          </Card>
        </Grid>
      </Grid>
    </ContentContainer>
  );
};
