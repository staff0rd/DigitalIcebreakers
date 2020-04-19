import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/icons/Menu";
import { toggleDrawer } from "../../../store/shell/actions";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  header: {
    position: 'fixed',
    right: 0,
  }
});

export default function Header(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <Hidden mdUp implementation="css">
      <div className={classes.header}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => dispatch(toggleDrawer())}
        >
          <Menu />
        </IconButton>
      </div>
    </Hidden>
  );
}
