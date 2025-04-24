import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { useSelector } from "../../../../store/useSelector";
import { scoreBoardSelector } from "../../../Trivia/reducers/scoreBoardSelector";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Box } from "@mui/material";

const ScoreBoard = () => {
  const { scores } = useSelector(scoreBoardSelector);
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
