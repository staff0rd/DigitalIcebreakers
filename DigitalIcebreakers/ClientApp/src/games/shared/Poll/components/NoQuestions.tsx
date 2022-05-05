import { makeStyles } from "@material-ui/core";
import Button from "@layout/components/CustomButtons/Button";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  header: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
}));

export const NoQuestions = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <>
      <h1 className={classes.header}>No questions</h1>
      <Button color="primary" onClick={() => history.push("/questions")}>
        Add some
      </Button>
    </>
  );
};
