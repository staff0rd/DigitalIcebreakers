import React, { ReactNode } from "react";

import Button from "../layout/components/CustomButtons/Button";

import {
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
}));

type Props = {
  header: string;
  content: ReactNode;
  action: (close: Function) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
};

export const ConfirmDialog = (props: Props) => {
  const { header, content, action, setOpen, open } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    console.warn("ok");
    action(() => setOpen(false));
  };

  const classes = useStyles();

  const getContent = () => {
    if (typeof content === "string")
      return <Typography variant="body1">{content}</Typography>;
    else return content;
  };

  return (
    <Dialog
      PaperProps={{
        className: classes.paper,
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <Typography variant="h4">{header}</Typography>
        {getContent()}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleOk}>
          Ok
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
