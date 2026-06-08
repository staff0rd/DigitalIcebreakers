import { ReactNode, DOMAttributes } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import styles from "../../assets/jss/material-dashboard-react/components/buttonStyle";
import { createSxClasses } from "createSxClasses";

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

const useOverrides = makeStyles(() => ({
  button: {
    "& .MuiButton-startIcon": {
      marginRight: 0,
    },
  },
}));

export default function RegularButton(props: Props) {
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
  const btnSx = createSxClasses(styles, {
    button: true,
    [size || "sm"]: size,
    [color || "primary"]: color,
    round: round,
    disabled,
    simple,
    block,
    link,
    justIcon,
    [className || ""]: className,
  });
  return (
    <Button
      {...rest}
      classes={muiClasses}
      sx={btnSx}
      className={overrides.button}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
}
