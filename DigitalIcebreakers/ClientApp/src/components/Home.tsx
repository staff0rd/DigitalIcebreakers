import React from "react";
import { Changelog } from "./Changelog";
import { GithubFork } from "./GithubFork";
import { makeStyles } from "@material-ui/core/styles";
import { ContentContainer } from "./ContentContainer";
import Button from "../layout/components/CustomButtons/Button";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    backgroundColor: "#191919",
    textAlign: "center",
  },
  image: {
    maxHeight: "320px",
    maxWidth: "100%",
  },
  howItWorks: {
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  joinButton: {
    marginLeft: theme.spacing(2),
  },
}));

export const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <>
      <GithubFork />
      <div className={classes.imageContainer}>
        <img
          className={classes.image}
          alt="Digital Icebreakers"
          src="img/digital-icebreakers.jpg"
        />
      </div>
      <ContentContainer>
        <div className={classes.buttonContainer}>
          <Button
            color="primary"
            size="lg"
            onClick={() => history.push("/create-lobby")}
            data-testid="present-button"
          >
            Present
          </Button>
          <Button
            className={classes.joinButton}
            color="primary"
            size="lg"
            onClick={() => history.push("/join-lobby")}
          >
            Join
          </Button>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Feedback</Typography>
            <Typography variant="body1">
              Feature requests, suggestions, bugs &amp; feedback to{" "}
              <a href="https://github.com/staff0rd/digitalicebreakers/issues">
                backlog
              </a>{" "}
              or <a href="mailto:stafford@atqu.in">stafford@atqu.in</a>
            </Typography>
            <Typography variant="h4" className={classes.howItWorks}>
              How it works
            </Typography>
            <Typography variant="body1">
              A presenter creates a Lobby and audience members join by pointing
              their phone cameras at the presenter's screen and scanning the QR
              code. The presenter can then guide the audience through games and
              experiences by clicking New Activity.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Changelog />
          </Grid>
        </Grid>
      </ContentContainer>
    </>
  );
};
