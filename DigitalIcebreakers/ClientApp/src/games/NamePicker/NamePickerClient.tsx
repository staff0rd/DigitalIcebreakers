import React, { useEffect, useState } from "react";
import { useSelector } from "../../store/useSelector";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setGameMessageCallback } from "../../store/connection/actions";
import { Colors, ColorUtils } from "../../Colors";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexDirection: "column",
  },
}));

const NamePickerClient = () => {
  const user = useSelector((s) => s.user);
  const [selectedId, setSelectedId] = useState<string>();
  const won = selectedId === user.id;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGameMessageCallback(setSelectedId));
  }, [dispatch]);

  const getBackgroundColor = () => {
    if (selectedId) {
      if (won) {
        return ColorUtils.toHtml(Colors.Green.C200);
      } else {
        return ColorUtils.toHtml(Colors.Red.C200);
      }
    }
    return "#eeeeee";
  };

  return (
    <div
      className={classes.root}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <h1>{user.name}</h1>
      {selectedId && (
        <h2>
          {won && "You won!"}
          {!won && "You lost :("}
        </h2>
      )}
    </div>
  );
};

export default NamePickerClient;
