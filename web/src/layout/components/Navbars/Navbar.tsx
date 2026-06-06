import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import { useSetAtom } from "jotai";
import { toggleDrawerAtom } from "../../../store/atoms/shellAtoms";
import makeStyles from "@mui/styles/makeStyles";
import { Box } from "@mui/material";

const useStyles = makeStyles({
  header: {
    position: "fixed",
    right: 0,
  },
});

export default function Navbar(props) {
  const toggleDrawer = useSetAtom(toggleDrawerAtom);
  const classes = useStyles();
  return (
    <Box sx={{ display: { md: "none", sx: "block" } }}>
      <div className={classes.header}>
        <IconButton
          sx={{ color: "white" }}
          aria-label="open drawer"
          onClick={() => toggleDrawer()}
        >
          <Menu />
        </IconButton>
      </div>
    </Box>
  );
}
