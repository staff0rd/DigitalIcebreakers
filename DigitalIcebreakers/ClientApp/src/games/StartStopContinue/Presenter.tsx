import React from "react";
import { ContentContainer } from "components/ContentContainer";
import { Category, getCategories, Categories } from "./Category";
import GridContainer from "layout/components/Grid/GridContainer";
import GridItem from "layout/components/Grid/GridItem";
import CardBody from "layout/components/Card/CardBody";
import Card from "layout/components/Card/Card";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "store/useSelector";
import { RootState } from "store/RootState";

const useStyles = makeStyles((theme) => ({
  header: {},
  waiting: {
    marginLeft: theme.spacing(3),
    padding: theme.spacing(2),
  },
  card: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const Presenter = () => {
  const classes = useStyles();
  const ideas = useSelector(
    (state: RootState) => state.games.startStopContinue.ideas
  );
  const ideasByCategory = (category: string) =>
    ideas.filter(
      (idea) => idea.payload.category === Category[category as Categories]
    );

  return (
    <ContentContainer>
      {getCategories().map((category) => (
        <>
          <Typography variant="h4" className={classes.header}>
            {category}
          </Typography>
          <GridContainer>
            {!ideasByCategory(category).length && (
              <Typography className={classes.waiting} variant="body1">
                Waiting for audience...
              </Typography>
            )}
            {ideasByCategory(category).map((idea) => (
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes.card}>
                  <CardBody>
                    <Typography variant="body1">
                      {idea.payload.message}
                    </Typography>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </GridContainer>
        </>
      ))}
    </ContentContainer>
  );
};
