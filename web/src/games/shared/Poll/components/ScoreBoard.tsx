import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { useSelector } from "../../../../store/useSelector";
import { triviaStateAtom } from "../../../Trivia/triviaAtoms";
import { Response } from "../types/Response";

interface UserScore {
  name: string;
  id: string;
  score: number;
}

const ScoreBoard = () => {
  const { presenter } = useAtomValue(triviaStateAtom);
  const players = useSelector((state) => state.lobby.players);

  const correctResponses = presenter.questions.flatMap((question) => {
    const correctAnswer = question.answers.find((answer) => answer.correct);
    return question.responses.filter(
      (response) => response.answerId === correctAnswer?.id
    );
  });

  const uniqueIds = [...new Set(correctResponses.map((r) => r.playerId))];

  const scores: UserScore[] = uniqueIds.map((id) => ({
    name: correctResponses.find((r: Response) => r.playerId === id)!
      .playerName,
    id,
    score: correctResponses.filter((r) => r.playerId === id).length,
  }));

  scores.sort((a, b) => b.score - a.score);

  scores.push(
    ...players
      .filter((player) => !scores.find((score) => score.id === player.id))
      .map((player) => ({ name: player.name, id: player.id, score: 0 }))
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Scores</h1>
      <Table sx={{ maxWidth: "50%" }}>
        <TableBody>
          {scores.map((user, ix) => (
            <TableRow key={ix.toString()}>
              <TableCell className="scoreboard-name" component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell
                className="scoreboard-score"
                component="th"
                scope="row"
              >
                {user.score}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ScoreBoard;
