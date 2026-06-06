import { useEffect } from "react";
import { ContentContainer } from "components/ContentContainer";
import GridContainer from "layout/components/Grid/GridContainer";
import GridItem from "layout/components/Grid/GridItem";
import CardBody from "layout/components/Card/CardBody";
import Card from "layout/components/Card/Card";
import { Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { retrospectiveAtom } from "./retrospectiveAtoms";
import { ideasByCategory } from "./ideasByCategory";
import SetCategories from "./SetCategories";
import { presenterMessageAtom } from "store/jotai/signalRAtoms";
import makeStyles from "@mui/styles/makeStyles";

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
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);
  const { ideas, categories } = useAtomValue(retrospectiveAtom).presenter;

  useEffect(() => {
    if (categories.length) sendPresenterMessage(categories);
  }, [categories]);

  return (
    <ContentContainer>
      {categories.length ? (
        categories.map((category, ix) => (
          <>
            <Typography variant="h4" className={classes.header}>
              {category.name}
            </Typography>
            <GridContainer>
              {!ideasByCategory(ideas, ix).length && (
                <Typography className={classes.waiting} variant="body1">
                  Waiting for audience...
                </Typography>
              )}
              {ideasByCategory(ideas, ix).map((idea) => (
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
        ))
      ) : (
        <SetCategories />
      )}
    </ContentContainer>
  );
};
