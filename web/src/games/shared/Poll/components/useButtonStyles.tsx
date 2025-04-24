import makeStyles from "@mui/styles/makeStyles";

export const useButtonStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    padding: theme.spacing(2),
  },
}));
