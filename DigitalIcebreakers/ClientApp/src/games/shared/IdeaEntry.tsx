import React from "react";
import Grid from "@material-ui/core/Grid";
import CardBody from "layout/components/Card/CardBody";
import CardTitle from "layout/components/Card/CardTitle";
import CustomInput from "layout/components/CustomInput/CustomInput";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  input: {
    margin: 0,
  },
}));

type Props = {
  idea: string;
  setIdea: (idea: string) => void;
  maxCharacters: number;
  maxLines: number;
};

export const IdeaEntry = (props: Props) => {
  const classes = useStyles();
  const { idea, setIdea, maxCharacters, maxLines } = props;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (
      target.value.split("\n").length <= maxLines &&
      target.value.length < maxCharacters
    )
      setIdea(target.value);
  };

  return (
    <>
      <CardTitle title="Your idea" subTitle="Add your idea to the board" />
      <CardBody>
        <Grid container>
          <Grid item xs={12} sm={12} md={6}>
            <CustomInput
              multiline
              rows={4}
              id="idea-value"
              labelText={`Your idea (${idea.length}/${maxCharacters})`}
              formControlProps={{
                className: classes.input,
                fullWidth: true,
              }}
              value={idea}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </CardBody>
    </>
  );
};
