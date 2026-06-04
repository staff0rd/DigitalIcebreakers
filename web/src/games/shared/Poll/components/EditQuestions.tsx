import { useRef, useState } from "react";
import Card from "../../../../layout/components/Card/Card";
import CardTitle from "../../../../layout/components/Card/CardTitle";
import CardFooter from "../../../../layout/components/Card/CardFooter";
import CardBody from "../../../../layout/components/Card/CardBody";
import Button from "../../../../layout/components/CustomButtons/Button";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { useSelector } from "../../../../store/useSelector";
import { useAtom } from "jotai";
import { ContentContainer } from "../../../../components/ContentContainer";
import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate, NavLink } from "react-router";
import { guid } from "../../../../util/guid";
import array from "../../../../util/array";
import { saveAs } from "file-saver";
import { BulkEdit } from "./BulkEdit";
import { Name as PollName } from "games/Poll";
import { ConfirmDialog } from "components/ConfirmDialog";
import { AutoQuestions } from "./AutoQuestions";
import { pollStateAtom, setQuestionsAtom as setPollQuestionsAtom } from "../../../Poll/pollAtoms";
import { triviaStateAtom, setQuestionsAtom as setTriviaQuestionsAtom } from "../../../Trivia/triviaAtoms";
import { Question } from "../types/Question";

const useStyles = makeStyles(() => ({
  table: {},
  answers: {
    paddingLeft: 0,
    listStyle: "none",
  },
  file: {
    display: "none",
  },
  checked: {
    "&::before": { content: '"☑️"' },
  },
  unchecked: {
    "&::before": {
      content: '"☐"',
      paddingRight: 8,
    },
  },
  footer: {
    flexWrap: "wrap",
    justifyContent: "normal",
  },
}));

const EditQuestions = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Get state from both Jotai atoms
  const [pollState] = useAtom(pollStateAtom);
  const [triviaState] = useAtom(triviaStateAtom);
  const [, setPollQuestions] = useAtom(setPollQuestionsAtom);
  const [, setTriviaQuestions] = useAtom(setTriviaQuestionsAtom);

  const { questions, gameName, isTriviaMode } = useSelector((state) => {
    const gameName = state.lobby.currentGame!;
    const isTriviaMode = gameName !== PollName;

    // Use Jotai state for both Poll and Trivia
    const questions = gameName === PollName
      ? pollState.presenter.questions
      : triviaState.presenter.questions;

    return {
      questions,
      gameName,
      isTriviaMode,
    };
  });
  const addQuestion = () => {
    const id = guid();

    const newQuestion = {
      id,
      text: "Change this text to your question",
      answers: [{ id: guid(), text: "An answer", correct: false }],
      responses: [],
    };

    if (gameName === PollName) {
      setPollQuestions([...questions, newQuestion]);
    } else {
      setTriviaQuestions([...questions, newQuestion]);
    }

    navigate(`/questions/${id}`);
  };
  const fileUpload = useRef<HTMLInputElement>(null);

  const exportQuestions = () => {
    const fileName = "questions.json";
    const fileToSave = new Blob([JSON.stringify(questions, null, 4)], {
      type: "application/json",
    });
    saveAs(fileToSave, fileName);
  };

  const importQuestions = () => {
    if (null !== fileUpload.current) {
      const file = fileUpload.current.files![0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt: ProgressEvent<FileReader>) => {
          if (evt.target && typeof evt.target.result === "string") {
            const importedQuestions = JSON.parse(evt.target.result);

            if (gameName === PollName) {
              setPollQuestions(importedQuestions);
            } else {
              setTriviaQuestions(importedQuestions);
            }

            if (fileUpload.current !== null) {
              fileUpload.current.value = "";
            }
          }
        };
      }
    }
  };

  const [confirmClearQuestionsOpen, setConfirmClearQuestionsOpen] =
    useState(false);
  const [confirmClearResponsesOpen, setConfirmClearResponsesOpen] =
    useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [autoQuestionsOpen, setAutoQuestionsOpen] = useState(false);
  return (
    <>
      <BulkEdit
        gameName={gameName}
        isTriviaMode={isTriviaMode}
        questions={questions}
        open={bulkEditOpen}
        setOpen={setBulkEditOpen}
      />
      {isTriviaMode && (
        <AutoQuestions
          open={autoQuestionsOpen}
          setOpen={setAutoQuestionsOpen}
        />
      )}
      <ContentContainer>
        <Card>
          <CardTitle
            title="Questions"
            subTitle="Edit and arrange your questions here"
          />
          <CardFooter className={classes.footer}>
            <Button onClick={() => addQuestion()}>Add question</Button>
            <Button onClick={() => setBulkEditOpen(true)}>Bulk edit</Button>
            {isTriviaMode && (
              <Button onClick={() => setAutoQuestionsOpen(true)}>
                Auto questions
              </Button>
            )}
            <Button onClick={() => setConfirmClearQuestionsOpen(true)}>
              Clear all questions
            </Button>
            <ConfirmDialog
              header="Clear all questions?"
              content="All questions and responses will be deleted"
              action={() => {
                if (gameName === PollName) {
                  setPollQuestions([]);
                } else {
                  setTriviaQuestions([]);
                }
                setConfirmClearQuestionsOpen(false);
              }}
              open={confirmClearQuestionsOpen}
              setOpen={setConfirmClearQuestionsOpen}
            />
            <Button onClick={() => setConfirmClearResponsesOpen(true)}>
              Clear all responses
            </Button>
            <ConfirmDialog
              header="Clear all responses?"
              content="All responses will be deleted"
              action={() => {
                const clearedQuestions = questions.map(q => ({ ...q, responses: [] }));
                if (gameName === PollName) {
                  setPollQuestions(clearedQuestions);
                } else {
                  setTriviaQuestions(clearedQuestions);
                }
                setConfirmClearResponsesOpen(false);
              }}
              open={confirmClearResponsesOpen}
              setOpen={setConfirmClearResponsesOpen}
            />
            <Button onClick={() => (fileUpload.current as any).click()}>
              Import questions
            </Button>
            <Button onClick={() => exportQuestions()}>Export questions</Button>
            <input
              ref={fileUpload}
              type="file"
              id="file-upload"
              accept="application/json"
              className={classes.file}
              onChange={() => importQuestions()}
            />
          </CardFooter>
          <CardBody>
            <TableContainer component={Paper}>
              <Table
                id="questions-table"
                className={classes.table}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Answers</TableCell>
                    <TableCell>Responses</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question, ix) => (
                    <TableRow key={question.id}>
                      <TableCell component="th" scope="row">
                        {question.text}
                      </TableCell>
                      <TableCell>
                        <ul className={classes.answers}>
                          {question.answers.map((a, ix) => (
                            <li
                              className={
                                isTriviaMode
                                  ? a.correct
                                    ? classes.checked
                                    : classes.unchecked
                                  : ""
                              }
                              key={ix.toString()}
                            >
                              {a.text}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{question.responses.length}</TableCell>
                      <TableCell>
                        <NavLink to={`/questions/${question.id}`}>
                          <IconButton>
                            <Edit />
                          </IconButton>
                        </NavLink>
                        <IconButton
                          disabled={ix === 0}
                          onClick={() => {
                            const reorderedQuestions = array.moveUp(
                              questions,
                              questions.indexOf(question)
                            );
                            if (gameName === PollName) {
                              setPollQuestions(reorderedQuestions);
                            } else {
                              setTriviaQuestions(reorderedQuestions);
                            }
                          }}
                        >
                          <ArrowUpward />
                        </IconButton>
                        <IconButton
                          disabled={ix === questions.length - 1}
                          onClick={() => {
                            const reorderedQuestions = array.moveDown(
                              questions,
                              questions.indexOf(question)
                            );
                            if (gameName === PollName) {
                              setPollQuestions(reorderedQuestions);
                            } else {
                              setTriviaQuestions(reorderedQuestions);
                            }
                          }}
                        >
                          <ArrowDownward />
                        </IconButton>
                        <IconButton
                          disabled={questions.length === 1}
                          onClick={() => {
                            const updatedQuestions = questions.filter(q => q.id !== question.id);
                            if (gameName === PollName) {
                              setPollQuestions(updatedQuestions);
                            } else {
                              setTriviaQuestions(updatedQuestions);
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </ContentContainer>
    </>
  );
};

export default EditQuestions;
