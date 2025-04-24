import Button from "../../layout/components/CustomButtons/Button";
import { clientMessage } from "../../store/lobby/actions";
import makeStyles from "@mui/styles/makeStyles";
import { useDispatch } from "store/useSelector.js";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  button: {
    height: 100,
    width: 300,
    fontSize: 20,
  },
}));

const YesNoMaybeClient = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const choose = (newChoice: string) => {
    dispatch(clientMessage(newChoice));
  };

  return (
    <div className={classes.container}>
      <Button className={classes.button} onClick={() => choose("0")}>
        Yes
      </Button>
      <Button className={classes.button} onClick={() => choose("1")}>
        No
      </Button>
    </div>
  );
};
export default YesNoMaybeClient;
