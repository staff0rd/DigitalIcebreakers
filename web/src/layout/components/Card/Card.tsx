import { Box } from "@mui/material";
import { createSxClasses } from "createSxClasses";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/cardStyle";

type CardProps = {
  className?: string;
  plain?: boolean;
  profile?: boolean;
  chart?: boolean;
  children?: React.ReactNode;
};

export default function Card(props: CardProps) {
  const { className, children, plain, profile, chart, ...rest } = props;
  const cardClasses = createSxClasses(styles, {
    card: true,
    cardPlain: plain,
    cardProfile: profile,
    cardChart: chart,
  });
  return (
    <Box sx={cardClasses} {...rest}>
      {children}
    </Box>
  );
}
