// core components
import styles from "../../assets/jss/material-dashboard-react/components/cardBodyStyle";
import { createSxClasses } from "createSxClasses";
import { Box } from "@mui/material";

type CardBodyProps = {
  className?: string;
  plain?: boolean;
  profile?: boolean;
  children?: React.ReactNode;
};

export default function CardBody(props: CardBodyProps) {
  const { className, children, plain, profile, ...rest } = props;
  const cardBodyClasses = createSxClasses(styles, {
    cardBody: true,
    cardBodyPlain: plain,
    cardBodyProfile: profile,
  });
  return (
    <Box sx={cardBodyClasses} {...rest}>
      {children}
    </Box>
  );
}
