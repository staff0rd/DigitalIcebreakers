import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

type Props = {
  children: ReactNode,
}

export default ({ children }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {children}
    </div>
  )
}