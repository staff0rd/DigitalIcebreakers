// @mui/material components
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/GridLegacy";

const styles = {
  grid: {
    padding: "0 15px !important",
  },
};

const useStyles = makeStyles(styles);

export default function GridItem(props: any) {
  const classes = useStyles();
  const { children, ...rest } = props;
  return (
    <Grid item {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}
