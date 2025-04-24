import PropTypes from "prop-types";
// @mui/material components
import makeStyles from "@mui/styles/makeStyles";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/typographyStyle";

const useStyles = makeStyles(styles);

export default function Info(props) {
  const classes = useStyles();
  const { children } = props;
  return (
    <div className={classes.defaultFontStyle + " " + classes.infoText}>
      {children}
    </div>
  );
}

Info.propTypes = {
  children: PropTypes.node,
};
