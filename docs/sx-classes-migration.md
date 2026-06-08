# SX Classes Migration Plan

## Overview

Create a utility function `createSxClasses` to help migrate from classNames to MUI sx props while maintaining similar conditional syntax and minimizing code changes.

## Implementation Details

### 1. Utility Function

Create a new utility function `createSxClasses` in `web/src/utils/createSxClasses.ts`:

```typescript
import { SxProps, Theme } from "@mui/material/styles";

type StylesObject = Record<string, any>;
type ConditionalClasses = Record<string, boolean | undefined>;

export const createSxClasses = (
  styles: StylesObject,
  conditionals: ConditionalClasses
): SxProps<Theme> => {
  const sxProps: SxProps<Theme> = {};

  Object.entries(conditionals).forEach(([className, condition]) => {
    if (condition && styles[className]) {
      Object.assign(sxProps, styles[className]);
    }
  });

  return sxProps;
};
```

### 2. Component Migration Example

Before (using classNames):

```typescript
const btnClasses = classNames({
  [classes.button]: true,
  [classes[size]]: size,
  [classes[color]]: color,
  [classes.round]: round,
  [classes.disabled]: disabled,
});

return <Button className={btnClasses}>{children}</Button>;
```

After (using createSxClasses):

```typescript
const btnSx = createSxClasses(styles, {
  button: true,
  [size]: Boolean(size),
  [color]: Boolean(color),
  round,
  disabled,
});

return <Button sx={btnSx}>{children}</Button>;
```

### 3. Migration Steps

1. Create the utility function
2. Move style objects inline or to theme
3. Update components to use createSxClasses:
   - Import the utility
   - Convert classNames objects to createSxClasses calls
   - Replace className prop with sx
4. Remove classNames dependency
5. Clean up makeStyles imports

### 4. Benefits

- Maintains familiar conditional syntax
- Minimizes code changes
- Centralizes sx prop transformation
- Easier gradual migration
- Type safety through Theme typing

### 5. Example Style Object Format

```typescript
const styles = {
  button: {
    padding: 2,
    margin: 1,
  },
  primary: {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },
  disabled: {
    opacity: 0.7,
    pointerEvents: "none",
  },
};
```

## Migration Process

1. Create utility function
2. Convert one simple component as proof of concept
3. Document any issues or edge cases
4. Create migration guide for team
5. Gradually migrate remaining components
6. Remove unused dependencies and clean up

## Next Steps

1. Switch to Code mode to implement the utility function
2. Test with a simple component like GridContainer
3. Document any challenges or adjustments needed
4. Create plan for full codebase migration
