import { ReactNode } from "react";
import classNames from "classnames";
// @mui/material components
import makeStyles from "@mui/styles/makeStyles";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import InputLabel, { InputLabelProps } from "@mui/material/InputLabel";
import Input, { InputProps } from "@mui/material/Input";
// @mui/icons-material
import Clear from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/customInputStyle";

const useStyles = makeStyles(styles);

type Props = {
  labelText: ReactNode;
  labelProps?: InputLabelProps;
  id: string;
  inputProps?: InputProps;
  formControlProps: FormControlProps;
  error?: boolean;
  success?: boolean;
} & Partial<InputProps>;

export default function CustomInput(props: Props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    error,
    success,
    ...rest
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error,
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
  });
  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined,
  });
  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.className + " " + classes.formControl}
    >
      {labelText !== undefined ? (
        <InputLabel
          className={classes.labelRoot + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        classes={{
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses,
        }}
        id={id}
        {...rest}
      />
      {error ? (
        <Clear className={classes.feedback + " " + classes.labelRootError} />
      ) : success ? (
        <Check className={classes.feedback + " " + classes.labelRootSuccess} />
      ) : null}
    </FormControl>
  );
}
