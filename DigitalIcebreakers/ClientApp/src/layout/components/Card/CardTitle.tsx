import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "./CardHeader.js";

const styles: any = {
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    }
  };
  
  const useStyles = makeStyles(styles);
  
  type Props = {
    title: string,
    subTitle?: string
  }
  
  export default ({ title, subTitle }: Props) => {
    const classes = useStyles();
    return (
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>{title}</h4>
        { subTitle && (
          <p className={classes.cardCategoryWhite}>{subTitle}</p> 
        )}
      </CardHeader>
    )
  }