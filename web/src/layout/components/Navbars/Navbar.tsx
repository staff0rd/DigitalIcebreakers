import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import { toggleDrawer } from "../../../store/shell/actions";
import { useDispatch } from "store/useSelector";
import makeStyles from "@mui/styles/makeStyles";
import { Box } from "@mui/material";

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
    <Box sx={{ display: { md: "none", sx: "block" } }}>
      <div className={classes.header}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => dispatch(toggleDrawer())}
        >
          <Menu />
        </IconButton>
      </div>
    </Box>
  );
}
