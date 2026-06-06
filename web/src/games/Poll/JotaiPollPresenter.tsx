import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { presenterMessageAtom } from "store/jotai/signalRAtoms";
import { lobbyAtom } from "store/atoms/lobbyAtoms";
import { Box, IconButton } from "@mui/material";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import BarChart from "@mui/icons-material/BarChart";
import LiveHelp from "@mui/icons-material/LiveHelp";
import ResponseChart from "../shared/Poll/components/ResponseChart";
import QuestionAndResponseCount from "../shared/Poll/components/QuestionAndResponseCount";
import { NoQuestions } from "../shared/Poll/components/NoQuestions";
import {
  pollStateAtom,
  setCurrentQuestionIdAtom,
  toggleResponsesAtom
} from "./pollAtoms";
import { Question } from "../shared/Poll/types/Question";

export const JotaiPollPresenter = () => {
  const [pollState] = useAtom(pollStateAtom);
  const [, setCurrentQuestionId] = useAtom(setCurrentQuestionIdAtom);
  const [, toggleResponses] = useAtom(toggleResponsesAtom);
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);

  const playerCount = useAtomValue(lobbyAtom).players.length;

  const { questions, currentQuestionId, showResponses } = pollState.presenter;

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

  // Send current question to players
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
      <ResponseChart question={question} isTriviaMode={false} />
    ) : (
      <QuestionAndResponseCount
        responseCount={responseCount}
        playerCount={playerCount}
        question={question!}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
      />
    );

  return (
    <>
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

      {/* Poll control buttons */}
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
          onClick={() => toggleResponses()}
          sx={{ color: "white" }}
        >
          {showResponses ? <LiveHelp /> : <BarChart />}
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