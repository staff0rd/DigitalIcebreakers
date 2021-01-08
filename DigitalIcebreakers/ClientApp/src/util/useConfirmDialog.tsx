import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../layout/components/CustomButtons/Button";
import Modal from "@material-ui/core/Modal";
import { Action } from "redux";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    minWidth: 400,
    backgroundColor: "white",
    borderRadius: "5px",
    padding: 20,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export const useConfirmDialog = (
  title: string,
  body: string,
  action: Action
) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const ok = () => {
    dispatch(action);
    setOpen(false);
  };

  const classes = useStyles();

  const component = () => (
    <Modal className={classes.modalContainer} open={open} onClose={handleClose}>
      <div className={classes.modal}>
        <h3>{title}</h3>
        <p>{body}</p>
        <div className={classes.buttons}>
          <Button color="primary" onClick={() => ok()}>
            Ok
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );

  return {
    component,
    open: () => setOpen(true),
  };
};
