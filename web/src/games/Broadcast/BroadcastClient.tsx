import Button from "../../layout/components/CustomButtons/Button";
import { useDispatch } from "store/useSelector";
import Notifications from "@mui/icons-material/Notifications";
import { clientMessage } from "../../store/lobby/actions";
import makeStyles from "@mui/styles/makeStyles";
import { useSelector } from "store/useSelector";

const useStyles = makeStyles(() => ({
  wrapper: {
    textAlign: "center",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    height: 100,
    width: 150,
  },
}));

export const BroadcastClient = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clientText = useSelector((state) => state.games.broadcast.client.text);

  const ding = () => {
    dispatch(clientMessage(1));
  };

  return (
    <div className={classes.wrapper}>
      <h1 data-testid="client-text">{clientText}</h1>
      <Button className={classes.button} color="primary" onClick={ding}>
        <Notifications />
      </Button>
    </div>
  );
};
