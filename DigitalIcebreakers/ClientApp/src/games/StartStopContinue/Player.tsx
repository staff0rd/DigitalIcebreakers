import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clientMessage } from "../../store/lobby/actions";
import { ContentContainer } from "../../components/ContentContainer";
import Grid from "@material-ui/core/Grid";
import Card from "../../layout/components/Card/Card";
import CardFooter from "../../layout/components/Card/CardFooter";
import Button from "../../layout/components/CustomButtons/Button";
import { IdeaEntry } from "games/shared/IdeaEntry";

enum Category {
  Start,
  Stop,
  Continue,
}
type Categories = keyof typeof Category;

type Payload = {
  category: Category;
  message: string;
};

const getCategories = () =>
  Object.keys(Category).filter((key) => isNaN(Number(key)));

export const Player = () => {
  const dispatch = useDispatch();
  const [idea, setIdea] = useState<string>("");

  const onClick = (
    e: React.SyntheticEvent<EventTarget>,
    category: Category
  ) => {
    if (idea.length) {
      dispatch(clientMessage({ category, message: idea } as Payload));
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
            <CardFooter>
              {getCategories().map((category) => (
                <Button
                  color="primary"
                  onClick={(e) => onClick(e, Category[category as Categories])}
                >
                  {category}
                </Button>
              ))}
            </CardFooter>
          </Card>
        </Grid>
      </Grid>
    </ContentContainer>
  );
};
