import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import { useSetAtom } from "jotai";
import { toggleDrawerAtom } from "../../../store/atoms/shellAtoms";
import { Box } from "@mui/material";

export default function Navbar(props) {
  const toggleDrawer = useSetAtom(toggleDrawerAtom);
  return (
    <Box sx={{ display: { md: "none", xs: "block" } }}>
      <IconButton
        sx={{
          position: "fixed",
          right: 0,
          zIndex: "appBar",
          color: "text.primary",
        }}
        aria-label="open drawer"
        onClick={() => toggleDrawer()}
      >
        <Menu />
      </IconButton>
    </Box>
  );
}
