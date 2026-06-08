import { ReactNode } from "react";
// @mui/material components
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import InputLabel, { InputLabelProps } from "@mui/material/InputLabel";
import Input, { InputProps } from "@mui/material/Input";
// @mui/icons-material
import Clear from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/customInputStyle";
import { createSxClasses } from "createSxClasses";

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
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    error,
    success,
    ...rest
  } = props;

  return (
    <FormControl
      {...formControlProps}
      sx={styles.formControl}
      className={formControlProps.className}
    >
      {labelText !== undefined ? (
        <InputLabel
          variant="standard"
          sx={createSxClasses(styles, {
            labelRoot: true,
            labelRootError: error,
            labelRootSuccess: success && !error,
          })}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        slotProps={{
          root: {
            sx: {
              ...styles.marginTop,
              "&.MuiInput-disabled": styles.disabled,
              "&.MuiInput-underline": createSxClasses(styles, {
                underline: true,
                underlineError: error,
                underlineSuccess: success && !error,
              }),
            },
          },
        }}
        id={id}
        {...rest}
      />
      {error ? (
        <Clear
          sx={createSxClasses(styles, {
            feedback: true,
            labelRootError: error,
          })}
        />
      ) : success ? (
        <Check
          sx={createSxClasses(styles, {
            feedback: true,
            labelRootSuccess: success && !error,
          })}
        />
      ) : null}
    </FormControl>
  );
}
