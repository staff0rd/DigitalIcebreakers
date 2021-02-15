import { makeStyles } from "@material-ui/core/styles";

export const useButtonStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    padding: theme.spacing(2),
  },
}));
