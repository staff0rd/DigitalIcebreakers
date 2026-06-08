import { Box, Typography } from "@mui/material";
import CardHeader from "./CardHeader";

type Props = {
  title: string;
  subTitle?: string;
};

const CardTitle = ({ title, subTitle }: Props) => {
  return (
    <CardHeader color="primary">
      <Typography
        variant="h5"
        sx={{
          color: "#FFFFFF",
          marginTop: "0px",
          minHeight: "auto",
          fontWeight: "300",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          marginBottom: "3px",
          textDecoration: "none",
        }}
      >
        {title}
      </Typography>
      {subTitle && (
        <Box
          component="p"
          sx={{
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          {subTitle}
        </Box>
      )}
    </CardHeader>
  );
};
export default CardTitle;
