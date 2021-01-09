import React, { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    marginTop: 0,
    paddingTop: 0,
  },
}));

type Props = {
  children: ReactNode;
  header?: string;
};

export const ContentContainer = ({ children, header }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {header && (
        <Typography variant="h4" className={classes.header}>
          {header}
        </Typography>
      )}
      {children}
    </div>
  );
};
