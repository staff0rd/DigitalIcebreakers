import { Colors } from "../../Colors";
import { Shape } from "./Shape";
import { ShapeType } from "./ShapeType";
import { useAtomValue, useSetAtom } from "jotai";
import { clientMessage } from "../../store/lobby/actions";
import { useDispatch } from "store/useSelector";
import { reactionAtom, selectShapeAtom } from "./atoms";
import { Box } from "@mui/material";

const getShapeColor = (color: number) => {
  return `#${color.toString(16).padStart(6, '0')}`;
};

const ShapeComponent = ({ shape, isSelected, isDisabled, onSelect }: {
  shape: Shape;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: number) => void;
}) => {
  const shapeColor = getShapeColor(shape.color);
  const opacity = isDisabled && !isSelected ? 0.5 : 1;
  const borderColor = isSelected ? getShapeColor(Colors.BlueGrey.C900) : 'transparent';
  
  let shapeElement;
  const size = 120;
  
  switch (shape.type) {
    case ShapeType.Circle:
      shapeElement = (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: shapeColor,
            opacity,
            border: `5px solid ${borderColor}`,
            cursor: isDisabled ? 'default' : 'pointer',
          }}
          data-testid={`shape-${shape.id}`}
          data-shape-type="circle"
          data-selected={isSelected}
          onClick={() => !isDisabled && onSelect(shape.id)}
        />
      );
      break;
    case ShapeType.Triangle:
      shapeElement = (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${shapeColor}`,
            opacity,
            cursor: isDisabled ? 'default' : 'pointer',
            position: 'relative',
          }}
          data-testid={`shape-${shape.id}`}
          data-shape-type="triangle"
          data-selected={isSelected}
          onClick={() => !isDisabled && onSelect(shape.id)}
        >
          {isSelected && (
            <div
              style={{
                position: 'absolute',
                top: -5,
                left: -5,
                width: 0,
                height: 0,
                borderLeft: `${size / 2 + 5}px solid transparent`,
                borderRight: `${size / 2 + 5}px solid transparent`,
                borderBottom: `${size + 10}px solid ${borderColor}`,
                zIndex: -1,
              }}
            />
          )}
        </div>
      );
      break;
    case ShapeType.Square:
      shapeElement = (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: shapeColor,
            opacity,
            border: `5px solid ${borderColor}`,
            cursor: isDisabled ? 'default' : 'pointer',
          }}
          data-testid={`shape-${shape.id}`}
          data-shape-type="square"
          data-selected={isSelected}
          onClick={() => !isDisabled && onSelect(shape.id)}
        />
      );
      break;
    default:
      shapeElement = null;
  }
  
  return shapeElement;
};

export const ReactionPlayer = () => {
  const dispatch = useDispatch();
  const reactionState = useAtomValue(reactionAtom);
  const selectShape = useSetAtom(selectShapeAtom);
  const { shapes, selectedId } = reactionState.player;

  const select = (id: number) => {
    dispatch(clientMessage(id));
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
