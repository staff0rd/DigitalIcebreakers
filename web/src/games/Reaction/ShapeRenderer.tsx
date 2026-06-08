import { Shape } from "./Shape";
import { ShapeType } from "./ShapeType";
import { Box, Typography } from "@mui/material";

interface ShapeRendererProps {
  shape: Shape;
  size: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  cursor?: string;
  onClick?: () => void;
  testId?: string;
  children?: React.ReactNode;
  extraAttributes?: Record<string, string | number | boolean>;
}

const getShapeColor = (color: number) => {
  return `#${color.toString(16).padStart(6, '0')}`;
};

export const ShapeRenderer = ({
  shape,
  size,
  borderColor = 'transparent',
  borderWidth = 5,
  opacity = 1,
  cursor = 'default',
  onClick,
  testId,
  children,
  extraAttributes = {},
}: ShapeRendererProps) => {
  const shapeColor = getShapeColor(shape.color);
  
  const baseProps = {
    'data-testid': testId,
    'data-shape-type': shape.type,
    onClick,
    ...extraAttributes,
  };
  
  switch (shape.type) {
    case ShapeType.Circle:
      return (
        <div
          {...baseProps}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: shapeColor,
            opacity,
            border: `${borderWidth}px solid ${borderColor}`,
            cursor,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      );
      
    case ShapeType.Triangle:
      return (
        <div
          {...baseProps}
          style={{
            width: 0,
            height: 0,
            borderLeft: `calc(${size} / 2) solid transparent`,
            borderRight: `calc(${size} / 2) solid transparent`,
            borderBottom: `${size} solid ${shapeColor}`,
            opacity,
            cursor,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      );
      
    case ShapeType.Square:
      return (
        <div
          {...baseProps}
          style={{
            width: size,
            height: size,
            backgroundColor: shapeColor,
            opacity,
            border: `${borderWidth}px solid ${borderColor}`,
            cursor,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      );
      
    default:
      return null;
  }
};