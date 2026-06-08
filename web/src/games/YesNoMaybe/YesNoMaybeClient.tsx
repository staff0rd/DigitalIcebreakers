import Button from "../../layout/components/CustomButtons/Button";
import { useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/transportAtoms";
import makeStyles from "@mui/styles/makeStyles";

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
  const sendClientMessage = useSetAtom(clientMessageAtom);
  const classes = useStyles();

  const choose = (newChoice: string) => {
    sendClientMessage(newChoice);
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
