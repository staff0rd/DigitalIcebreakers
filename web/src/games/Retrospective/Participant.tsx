import { useState } from "react";
import { useDispatch } from "store/useSelector";
import { clientMessage } from "../../store/lobby/actions";
import { ContentContainer } from "../../components/ContentContainer";
import Grid from "@mui/material/GridLegacy";

import Card from "../../layout/components/Card/Card";
import CardFooter from "../../layout/components/Card/CardFooter";
import Button from "../../layout/components/CustomButtons/Button";
import { IdeaEntry } from "games/shared/IdeaEntry";
import { useSelector } from "store/useSelector";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
  footer: {
    display: "flex",
    flexWrap: "wrap",
  },
}));

export type PayloadFromParticipant = {
  category: number;
  message: string;
};

export const Participant = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [idea, setIdea] = useState<string>("");
  const categories = useSelector(
    (state) => state.games.retrospective.participant.categories
  );

  const onClick = (category: number) => {
    if (idea.length) {
      dispatch(
        clientMessage({ category, message: idea } as PayloadFromParticipant)
      );
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
              maxCharacters={200}
              maxLines={4}
            />
            <CardFooter className={classes.footer}>
              {categories.map((category, ix) => (
                <Button color="primary" onClick={() => onClick(ix)}>
                  {category.name}
                </Button>
              ))}
            </CardFooter>
          </Card>
        </Grid>
      </Grid>
    </ContentContainer>
  );
};
