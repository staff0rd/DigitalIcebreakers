import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import Menu from "@mui/icons-material/Menu";
import { toggleDrawer } from "../../../store/shell/actions";
import { useDispatch } from "store/useSelector.js";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  header: {
    position: "fixed",
    right: 0,
  },
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
