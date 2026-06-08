import { Card, CardActions } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/GridLegacy";

import Button from "layout/components/CustomButtons/Button";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { Category, setCategoriesAtom } from "./retrospectiveAtoms";
import CustomInput from "layout/components/CustomInput/CustomInput";
import Alert from "@mui/material/Alert";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
  form: {
    marginTop: 0,
  },
  input: {
    fontFamily: "monospace",
    lineHeight: 1,
  },
}));

const categories: Category[][] = [
  [
    { id: 0, name: "Start" },
    { id: 1, name: "Stop" },
    { id: 2, name: "Continue" },
  ],
  [
    { id: 0, name: "What went well" },
    { id: 1, name: "What didn't go well" },
  ],
];

const SetCategories = () => {
  const setCategories = useSetAtom(setCategoriesAtom);
  const [error, setError] = useState<string>("");
  const classes = useStyles();
  const [categoryLines, setCategoryLines] = useState<string>(
    "Category 1\nCategory 2\nOne per line"
  );
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCategoryLines(target.value);
  };
  const setCustomCategories = () => {
    const trimmed = categoryLines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    if (!trimmed.length) {
      setError("Specify at least one category");
    } else {
      setError("");
      setCategories(trimmed.map((t, ix) => ({ id: ix, name: t })));
    }
  };
  return (
    <>
      <Typography variant="h2">Set categories</Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <ul>
                  {category.map((section) => (
                    <li>{section.name}</li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => setCategories(category)}
                  size="sm"
                  color="primary"
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <CustomInput
                multiline
                id="custom-categories"
                rows={4}
                labelText="Custom"
                error={error.length > 0}
                className={classes.input}
                formControlProps={{
                  className: classes.form,
                  fullWidth: true,
                }}
                value={categoryLines}
                onChange={onChange}
              />
              {error.length > 0 && <Alert severity="error">{error}</Alert>}
            </CardContent>
            <CardActions>
              <Button
                onClick={() => setCustomCategories()}
                size="sm"
                color="primary"
                data-testid="select-custom"
              >
                Select
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SetCategories;
