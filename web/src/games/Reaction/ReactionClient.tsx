import { Colors } from "../../Colors";
import { Shape } from "./Shape";
import { ShapeType } from "./ShapeType";
import { useAtomValue, useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/signalRAtoms";
import { reactionAtom, selectShapeAtom } from "./atoms";
import { Box } from "@mui/material";
import { ShapeRenderer } from "./ShapeRenderer";

const getShapeColor = (color: number) => {
  return `#${color.toString(16).padStart(6, '0')}`;
};

const ShapeComponent = ({ shape, isSelected, isDisabled, onSelect }: {
  shape: Shape;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: number) => void;
}) => {
  const opacity = isDisabled && !isSelected ? 0.5 : 1;
  const borderColor = isSelected ? getShapeColor(Colors.BlueGrey.C900) : 'transparent';
  const size = '20vmin';
  
  return (
    <ShapeRenderer
      shape={shape}
      size={size}
      borderColor={borderColor}
      borderWidth={5}
      opacity={opacity}
      cursor={isDisabled ? 'default' : 'pointer'}
      onClick={() => !isDisabled && onSelect(shape.id)}
      testId={`shape-${shape.id}`}
      extraAttributes={{ 'data-selected': isSelected }}
    />
  );
};

export const ReactionPlayer = () => {
  const sendClientMessage = useSetAtom(clientMessageAtom);
  const reactionState = useAtomValue(reactionAtom);
  const selectShape = useSetAtom(selectShapeAtom);
  const { shapes, selectedId } = reactionState.player;

  const select = (id: number) => {
    sendClientMessage(id);
    selectShape(id);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: getShapeColor(Colors.White),
        gap: 3,
        padding: 2,
      }}
      data-testid="reaction-client"
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 3,
          maxWidth: '400px',
        }}
      >
        {shapes.map((shape) => (
          <ShapeComponent
            key={shape.id}
            shape={shape}
            isSelected={selectedId === shape.id}
            isDisabled={selectedId !== undefined}
            onSelect={select}
          />
        ))}
      </Box>
    </Box>
  );
};
