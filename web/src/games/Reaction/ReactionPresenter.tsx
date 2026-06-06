import { useEffect, useRef, useState } from "react";
import { Shape } from "./Shape";
import { Colors, ColorUtils } from "../../Colors";
import { ShapeType } from "./ShapeType";
import { shuffle } from "../../Random";
import { gsap } from "gsap";
import { presenterMessageAtom } from "store/jotai/transportAtoms";
import Button from "../../layout/components/CustomButtons/Button";
import Table from "../../layout/components/Table/Table";
import { ContentContainer } from "../../components/ContentContainer";
import { lobbyAtom } from "store/atoms/lobbyAtoms";
import AutoRenewIcon from "@mui/icons-material/Autorenew";
import { useAtomValue, useSetAtom } from "jotai";
import {
  reactionAtom,
  startRoundAtom,
  endRoundAtom,
  toggleAutoAgainAtom,
} from "./atoms";
import { useTimeout } from "util/useTimeout";
import { Box, Typography } from "@mui/material";
import { ShapeRenderer } from "./ShapeRenderer";

const getShapeColor = (color: number) => {
  return `#${color.toString(16).padStart(6, '0')}`;
};

const PresenterShapeComponent = ({ shape, choiceCount, firstPlayerName, isMainShape }: {
  shape: Shape;
  choiceCount: number;
  firstPlayerName: string;
  isMainShape: boolean;
}) => {
  const size = isMainShape ? '30vmin' : '15vmin';
  
  return (
    <ShapeRenderer
      shape={shape}
      size={size}
      testId={`presenter-shape-${shape.id}`}
      extraAttributes={{ 
        'data-choice-count': choiceCount,
        'data-first-player': firstPlayerName
      }}
    >
      {choiceCount > 0 && (
        <Typography 
          variant="h6" 
          color="white" 
          fontWeight="bold"
          sx={shape.type === ShapeType.Triangle ? { 
            position: 'absolute', 
            top: `calc(${size} * 0.4)`, 
            left: '50%', 
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: isMainShape ? '6vmin' : '4vmin'
          } : {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: isMainShape ? '6vmin' : '4vmin'
          }}
        >
          {choiceCount}
        </Typography>
      )}
      {!isMainShape && firstPlayerName && (
        <Typography 
          variant="caption" 
          color="black"
          sx={shape.type === ShapeType.Triangle ? { 
            position: 'absolute', 
            top: `calc(${size} + 1vmin)`, 
            fontSize: '2vmin', 
            left: '50%', 
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          } : { 
            position: 'absolute', 
            bottom: `calc(-3vmin - 10px)`, 
            fontSize: '2vmin', 
            fontWeight: 'bold' 
          }}
        >
          {firstPlayerName}
        </Typography>
      )}
    </ShapeRenderer>
  );
};

export const ReactionPresenter = () => {
  const [againTween, setAgainTween] = useState<gsap.core.Tween>();
  const players = useAtomValue(lobbyAtom).players;
  const againProgress = useRef<HTMLDivElement>(null);
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);
  const reactionState = useAtomValue(reactionAtom);
  const startRound = useSetAtom(startRoundAtom);
  const endRound = useSetAtom(endRoundAtom);
  const toggleAutoAgainAction = useSetAtom(toggleAutoAgainAtom);
  const { shape, shapes, scores, showScores, autoAgain, choices } = reactionState.presenter;

  const getOtherShapes = () => shapes.filter((s) => s.id !== shape!.id);

  const getPlayerName = (playerId?: string) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : "";
  };

  const setShape = () => {
    const colors = [
      Colors.Red.C500,
      Colors.Green.C500,
      Colors.Blue.C500,
      Colors.Indigo.C500,
      Colors.Orange.C500,
    ];
    let counter = 0;
    const allShapes: Shape[] = [];
    [ShapeType.Circle, ShapeType.Triangle, ShapeType.Square].forEach((s) => {
      allShapes.push(
        ...colors.map((c) => {
          return { id: counter++, type: s, color: c };
        })
      );
    });

    const newRoundShapes = shuffle(allShapes).slice(0, 6);
    startRound({ shapes: newRoundShapes, shape: newRoundShapes[0] });
    sendPresenterMessage(shuffle([...newRoundShapes]));
  };

  useEffect(() => {
    if (autoAgain && showScores && againProgress.current) {
      // Reset the progress bar width first
      gsap.set(againProgress.current, { width: "500px" });
      setAgainTween(
        gsap.to(againProgress.current, {
          width: "0px",
          duration: 5,
          ease: "power1.in",
          onComplete: () => setShape(),
        })
      );
    } else if (againTween) {
      againTween.kill();
      setAgainTween(undefined);
    }
  }, [autoAgain, showScores]);

  useTimeout(
    () => {
      if (shape) {
        endRound([...players]);
      }
    },
    2000,
    [shape, autoAgain]
  );


  useEffect(() => setShape(), []);

  if (showScores) {
    const tableData: any[] = [...scores]
      .sort((a, b) => b.score - a.score)
      .map((p, ix) => [p.score, p.name]);

    return (
      <ContentContainer header="Scores">
        <Table tableData={tableData} />
        <Button
          className="primary"
          startIcon={autoAgain ? <AutoRenewIcon /> : undefined}
          onClick={() => {
            toggleAutoAgainAction();
          }}
        >
          Again
        </Button>
        {autoAgain && (
          <div
            ref={againProgress}
            style={{
              marginTop: 15,
              width: 500,
              height: 50,
              backgroundColor: ColorUtils.toHtml(Colors.Red.C400),
            }}
          />
        )}
      </ContentContainer>
    );
  } else if (shape) {
    const otherShapes = getOtherShapes();
    
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: getShapeColor(Colors.White),
          gap: 4,
          padding: 2,
        }}
        data-testid="reaction-presenter"
      >
        {/* Main shape */}
        <Box sx={{ mb: 4 }}>
          <PresenterShapeComponent
            shape={shape}
            choiceCount={choices.filter((choice) => choice.choice === shape.id).length}
            firstPlayerName={getPlayerName(
              choices.find((choice) => choice.isFirst && choice.choice === shape.id)?.id
            )}
            isMainShape={true}
          />
        </Box>

        {/* Other shapes */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-end',
            mb: 4,
          }}
        >
          {otherShapes.map((s) => (
            <Box key={s.id} sx={{ position: 'relative' }}>
              <PresenterShapeComponent
                shape={s}
                choiceCount={choices.filter((choice) => choice.choice === s.id).length}
                firstPlayerName={getPlayerName(
                  choices.find((choice) => choice.isFirst && choice.choice === s.id)?.id
                )}
                isMainShape={false}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: getShapeColor(Colors.White),
        }}
        data-testid="reaction-presenter-loading"
      >
        <Typography variant="h4">Starting round...</Typography>
      </Box>
    );
  }
};
