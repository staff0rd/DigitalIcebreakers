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
  return (
    <>
      {getCategories().map((category) => (
        <ContentContainer header={category}>
          <GridContainer>
            {ideas
              .filter(
                (idea) =>
                  idea.payload.category === Category[category as Categories]
              )
              .map((idea) => (
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
        </ContentContainer>
      ))}
    </>
  );
};
