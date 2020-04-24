import React, { useState } from "react";
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import CustomInput from "../layout/components/CustomInput/CustomInput";
import Button from "../layout/components/CustomButtons/Button";
import Card from "../layout/components/Card/Card.js";
import CardBody from "../layout/components/Card/CardBody.js";
import CardFooter from "../layout/components/Card/CardFooter.js";
import { useDispatch } from "react-redux";
import { createLobby } from '../store/lobby/actions'
import CardTitle from '../layout/components/Card/CardTitle';
import ContentContainer from './ContentContainer';

export default function CreateLobby() {
  const dispatch = useDispatch();
  
  const [lobbyName, setLobbyName] = useState<string>('My Lobby'); 

  const isValid = () => {
    return lobbyName.trim().length > 2;
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    setLobbyName(e.target.value);
    console.log(e.target.value, lobbyName);
  }

  const onClick = () => {
    if (isValid())
    {
      dispatch(createLobby(lobbyName!));
    }
  }

  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle title="Present" subTitle="Create a lobby for your audience to join" />
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
    </ContentContainer>
  );
}