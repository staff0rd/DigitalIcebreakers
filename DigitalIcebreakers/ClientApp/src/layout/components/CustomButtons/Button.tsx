import React, { ReactNode, DOMAttributes } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Button, { ButtonProps } from "@material-ui/core/Button";

import styles from "../../assets/jss/material-dashboard-react/components/buttonStyle";

const useStyles = makeStyles(styles);

type Color = 
  "primary" |
  "info" |
  "success" |
  "warning" |
  "danger" |
  "rose" |
  "white" |
  "transparent";

type Size = "sm" | "lg";

interface Props extends Partial<DOMAttributes<HTMLButtonElement>> {
  color?: Color,
  size?: Size,
  simple?: boolean,
  round?: boolean,
  disabled?: boolean,
  block?: boolean,
  link?: boolean,
  justIcon?: boolean,
  className?: string,
  muiClasses?: object,
  children?: ReactNode
};

export default function RegularButton(props: Props) {
  const classes = useStyles();
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
    [className || ""]: className
  });
  return (
    <Button {...rest} classes={muiClasses} className={btnClasses}>
      {children}
    </Button>
  );
}
