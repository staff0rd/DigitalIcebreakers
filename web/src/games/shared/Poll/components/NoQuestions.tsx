import makeStyles from "@mui/styles/makeStyles";
import Button from "layout/components/CustomButtons/Button";

import { useNavigate } from "react-router";

const useStyles = makeStyles(() => ({
  header: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
}));

export const NoQuestions = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <>
      <h1 className={classes.header}>No questions</h1>
      <Button color="primary" onClick={() => navigate("/questions")}>
        Add some
      </Button>
    </>
  );
};
