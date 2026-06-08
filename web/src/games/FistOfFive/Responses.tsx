import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Question } from "games/shared/Poll/types/Question";

type Props = {
  question: Question;
};
export const Responses = ({ question: { responses } }: Props) => {
  return (
    <>
      {responses.length && (
        <Typography data-testid="average-score" variant="h2">
          {Math.round(
            (responses
              .map((res) => parseInt(res.answerId))
              .reduce((sum, current) => sum + current, 0) /
              responses.length) *
              100
          ) / 100}
        </Typography>
      )}
      <Box
        component="ul"
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: 0,
          margin: 0,
          listStyle: "none"
        }}
      >
        {Array.from({ length: 5 }, (value, key) => key).map((ix) => (
          <Box
            component="li"
            key={ix}
            sx={{
              flex: 1,
              textAlign: "center",
              listStyle: "none"
            }}
          >
            {responses.length && (
              <Typography variant="body1">
                {Math.round(
                  (responses.filter((p) => p.answerId === `${ix + 1}`).length /
                    responses.length) *
                    100
                )}
                %
              </Typography>
            )}
            <Typography variant="h4">
              {ix + 1}
            </Typography>
            {responses
              .filter((p) => p.answerId === `${ix + 1}`)
              .map((res) => (
                <Typography key={res.playerId} sx={{ fontSize: "1.25rem" }} variant="body1">
                  {res.playerName}
                </Typography>
              ))}
          </Box>
        ))}
      </Box>
    </>
  );
};
