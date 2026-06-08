import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { presenterMessageAtom } from "store/jotai/transportAtoms";
import { lobbyAtom } from "store/atoms/lobbyAtoms";
import { Box, IconButton } from "@mui/material";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import BarChart from "@mui/icons-material/BarChart";
import LiveHelp from "@mui/icons-material/LiveHelp";
import ScoreIcon from "@mui/icons-material/Score";
import CloseIcon from "@mui/icons-material/Close";
import ResponseChart from "../shared/Poll/components/ResponseChart";
import QuestionAndResponseCount from "../shared/Poll/components/QuestionAndResponseCount";
import { NoQuestions } from "../shared/Poll/components/NoQuestions";
import ScoreBoard from "../shared/Poll/components/ScoreBoard";
import {
  triviaStateAtom,
  setCurrentQuestionIdAtom,
  toggleResponsesAtom,
  toggleScoreBoardAtom
} from "./triviaAtoms";

export const JotaiTriviaPresenter = () => {
  const [triviaState] = useAtom(triviaStateAtom);
  const [, setCurrentQuestionId] = useAtom(setCurrentQuestionIdAtom);
  const [, toggleResponses] = useAtom(toggleResponsesAtom);
  const [, toggleScoreBoard] = useAtom(toggleScoreBoardAtom);
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);

  const playerCount = useAtomValue(lobbyAtom).players.length;

  const { questions, currentQuestionId, showResponses, showScoreBoard } = triviaState.presenter;

  // Find current question
  const question = questions.find(q => q.id === currentQuestionId);

  // Calculate question navigation
  const questionIds = questions.map(q => q.id);
  const currentQuestionIndex = currentQuestionId
    ? questionIds.indexOf(currentQuestionId)
    : -1;
  const nextQuestionId = currentQuestionIndex < questionIds.length - 1
    ? questionIds[currentQuestionIndex + 1]
    : undefined;
  const previousQuestionId = currentQuestionIndex > 0
    ? questionIds[currentQuestionIndex - 1]
    : undefined;

  // Calculate response count
  const responseCount = question ? question.responses.length : 0;
  const currentQuestionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  // Set first question as current if none selected
  useEffect(() => {
    if (questionIds.length && !questionIds.includes(currentQuestionId || "")) {
      setCurrentQuestionId(questionIds[0]);
    }
  }, [questionIds, currentQuestionId, setCurrentQuestionId]);

  // The backend treats any message containing canAnswer as a CanAnswer broadcast and
  // never forwards the answers, so the question and canAnswer must be sent separately
  useEffect(() => {
    if (question) {
      sendPresenterMessage({
        questionId: question.id,
        answers: question.answers,
        question: question.text,
      });
    } else {
      sendPresenterMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resend only when the current question changes
  }, [currentQuestionId, sendPresenterMessage]);

  const canAnswer = !showResponses && !showScoreBoard;
  useEffect(() => {
    sendPresenterMessage({ canAnswer });
    return () => {
      sendPresenterMessage({ canAnswer: false });
    };
  }, [canAnswer, sendPresenterMessage]);

  const gotoNextQuestion = () => {
    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
    }
  };

  const gotoPreviousQuestion = () => {
    if (previousQuestionId) {
      setCurrentQuestionId(previousQuestionId);
    }
  };

  const QuestionDisplay = () =>
    showResponses ? (
      <ResponseChart question={question} isTriviaMode={true} />
    ) : (
      <QuestionAndResponseCount
        responseCount={responseCount}
        playerCount={playerCount}
        question={question!}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
      />
    );

  const QuestionOrScoreBoard = () => {
    if (showScoreBoard) {
      return <ScoreBoard />;
    }
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {question ? <QuestionDisplay /> : <NoQuestions />}
      </Box>
    );
  };

  return (
    <>
      <QuestionOrScoreBoard />

      {/* Trivia control buttons */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          p: 1,
        }}
      >
        <IconButton
          data-testid="previous-question"
          disabled={!previousQuestionId}
          onClick={gotoPreviousQuestion}
          sx={{ color: "white" }}
        >
          <NavigateBefore />
        </IconButton>

        <IconButton
          data-testid="show-responses"
          title="Toggle Responses"
          disabled={showScoreBoard}
          onClick={() => toggleResponses()}
          sx={{ color: "white" }}
        >
          {showResponses ? <LiveHelp /> : <BarChart />}
        </IconButton>

        <IconButton
          data-testid="show-scoreboard"
          onClick={() => toggleScoreBoard()}
          sx={{ color: "white" }}
        >
          {showScoreBoard ? <CloseIcon /> : <ScoreIcon />}
        </IconButton>

        <IconButton
          data-testid="next-question"
          disabled={!nextQuestionId}
          onClick={gotoNextQuestion}
          sx={{ color: "white" }}
        >
          <NavigateNext />
        </IconButton>
      </Box>
    </>
  );
};