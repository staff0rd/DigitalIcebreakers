import React, { useState, ChangeEventHandler } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import CustomInput from "../layout/components/CustomInput/CustomInput";
import Button from "../layout/components/CustomButtons/Button";
import Card from "../layout/components/Card/Card.js";
import CardHeader from "../layout/components/Card/CardHeader.js";
import CardBody from "../layout/components/Card/CardBody.js";
import CardFooter from "../layout/components/Card/CardFooter.js";


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

export default function CreateLobby() {
  const classes = useStyles();
  const [lobbyName, setLobbyName] = useState<string|null>('My Lobby'); 

  const isValid = () => {
    return !!lobbyName && lobbyName.length > 2;
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    setLobbyName(e.target.value);
    console.log(e.target.value, lobbyName);
  }

  const onClick = () => {
    console.log(lobbyName);
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Host</h4>
              <p className={classes.cardCategoryWhite}>Create a lobby for your audience to join</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Lobby name"
                    id="lobby-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={lobbyName}
                    onChange={(e) => handleChange(e)}
                    error={!isValid()}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={onClick}>Create</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}