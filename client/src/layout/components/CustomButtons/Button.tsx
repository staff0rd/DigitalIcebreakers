import React, { ReactNode, DOMAttributes } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import styles from "../../assets/jss/material-dashboard-react/components/buttonStyle";

const useStyles = makeStyles(styles);

type Color =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "rose"
  | "white"
  | "transparent";

type Size = "sm" | "lg";

interface Props extends Partial<DOMAttributes<HTMLButtonElement>> {
  color?: Color;
  size?: Size;
  simple?: boolean;
  round?: boolean;
  disabled?: boolean;
  block?: boolean;
  link?: boolean;
  justIcon?: boolean;
  className?: string;
  muiClasses?: object;
  startIcon?: ReactNode;
  children?: ReactNode;
}

const useOverrides = makeStyles((theme) => ({
  button: {
    "& .MuiButton-startIcon": {
      marginRight: 0,
    },
  },
}));

export default function RegularButton(props: Props) {
  const classes = useStyles();
  const overrides = useOverrides();
  const {
    color,
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    startIcon,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size || "sm"]]: size,
    [classes[color || "primary"]]: color,
    [classes.round]: round,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className || ""]: className,
  });
  return (
    <Button
      {...rest}
      classes={muiClasses}
      className={classNames(btnClasses, overrides.button)}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
}
