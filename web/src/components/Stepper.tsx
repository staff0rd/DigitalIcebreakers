import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface StepProps {
  label: string;
  step: number;
  value: number;
  setValue: (value: number) => void;
}

const Stepper = ({ label, step, value, setValue }: StepProps) => {
  const increaseValue = () => setValue(value + step);

  const decreaseValue = () => setValue(value - step);

  return (
    <Box>
      <Typography
        sx={{
          textTransform: "uppercase",
          color: "white",
          fontSize: "12px",
          lineHeight: ".5em",
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "stretch" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#9d9d9d",
            fontSize: "15px",
            minWidth: "auto",
            borderRadius: "3px 0 0 3px",
            px: 2,
            "&:hover": {
              backgroundColor: "#8d8d8d",
            },
          }}
          onClick={decreaseValue}
          aria-label={`Decrease ${label}`}
        >
          <RemoveIcon />
        </Button>
        <Box
          sx={{
            fontSize: "15px",
            lineHeight: 1.42857143,
            padding: 1.5,
            background: "#535353",
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            pointerEvents: "none",
            userSelect: "none",
            minWidth: "80px",
          }}
        >
          {value}
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#9d9d9d",
            fontSize: "15px",
            minWidth: "auto",
            borderRadius: "0 3px 3px 0",
            px: 2,
            "&:hover": {
              backgroundColor: "#8d8d8d",
            },
          }}
          onClick={increaseValue}
          aria-label={`Increase ${label}`}
        >
          <AddIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Stepper;
