import React from "react";
import { useSelector } from "../../../../store/useSelector";
import {
  currentQuestionSelector,
  GameState,
} from "../reducers/currentQuestionSelector";
import { makeStyles } from "@material-ui/core/styles";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { primaryColor } from "../../../../layout/assets/jss/material-dashboard-react";
import CustomisedAxisTick from "./CustomisedAccessTick";
import { RootState } from "store/RootState";
import { Answer, TriviaAnswer } from "games/shared/Poll/types/Answer";

const useStyles = makeStyles((theme) => ({
  data: {
    display: "none",
  },
  container: {
    padding: theme.spacing(3),
    width: "80%",
    height: "80%",
  },
  paper: {
    height: "100%",
    padding: theme.spacing(3),
  },
  cardHeader: {
    height: "100%",
  },
  chart: {
    height: "100%",
    "& .ct-label": {
      fontSize: "20px",
    },
  },
  question: {
    margin: 0,
  },
}));

type Props<T extends Answer> = {
  gameStateSelector: (state: RootState) => GameState<T>;
  isTriviaMode: boolean;
};
const ResponseChart = <T extends Answer>({
  gameStateSelector,
  isTriviaMode,
}: Props<T>) => {
  const classes = useStyles();
  const { question } = useSelector(currentQuestionSelector(gameStateSelector));

  const answers = question
    ? question.answers.map((a) => {
        let answer = a.text;
        if (isTriviaMode && ((a as unknown) as TriviaAnswer).correct) {
          answer = `✅ ${a.text}`;
        }
        const responses = (question ? question.responses : []).filter(
          (r) => r.answerId === a.id
        ).length;
        return {
          id: a.id,
          answer,
          responses,
        };
      })
    : [];

  const data = answers.map((a) => ({ name: a.answer, count: a.responses }));

  return (
    <>
      {question && (
        <div className={classes.container}>
          <ul className={classes.data}>
            {answers.map((a) => (
              <li className={classes.data} data-testid={`answer-${a.id}`}>
                <span className="count">{a.responses}</span>
              </li>
            ))}
          </ul>
          <ResponsiveContainer width="100%" height="80%" key={question?.id}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                tick={<CustomisedAxisTick maxLines={3} />}
                width={100}
                tickLine={false}
              />
              <Bar
                dataKey="count"
                fill={primaryColor[0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
          <h2 className={classes.question}>{question.text}</h2>
        </div>
      )}
    </>
  );
};

export default ResponseChart;
