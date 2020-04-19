import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    marginTop: 0,
    paddingTop: 0,
  }
}));

type Props = {
  children: ReactNode,
  header?: string,
}

export default ({ children, header }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      { header && (
        <h2 className={classes.header}>
          {header}
        </h2>
      )}
      {children}
    </div>
  )
}