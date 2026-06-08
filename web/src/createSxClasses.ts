import { SxProps, Theme } from "@mui/material/styles";

type StylesObject = Record<string, any>;
type ConditionalClasses = Record<string, any | undefined>;

export const createSxClasses = (
  styles: StylesObject,
  conditionals: ConditionalClasses
): SxProps<Theme> => {
  const sxProps: SxProps<Theme> = {};

  Object.entries(conditionals).forEach(([className, condition]) => {
    if (Boolean(condition) && styles[className]) {
      Object.assign(sxProps, styles[className]);
    }
  });

  return sxProps;
};
