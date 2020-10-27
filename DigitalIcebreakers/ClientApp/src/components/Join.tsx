import React, { useState } from "react";
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import CustomInput from "../layout/components/CustomInput/CustomInput";
import Button from "../layout/components/CustomButtons/Button";
import Card from "../layout/components/Card/Card.js";
import CardBody from "../layout/components/Card/CardBody.js";
import CardFooter from "../layout/components/Card/CardFooter.js";
import { useDispatch } from "react-redux";
import { joinLobby } from '../store/lobby/actions'
import CardTitle from '../layout/components/Card/CardTitle';
import ContentContainer from './ContentContainer';

export default function Join() {
  const dispatch = useDispatch();
  
  const [lobbyCode, setLobbyCode] = useState<string>(''); 

  const isValid = () => {
    return lobbyCode.trim().length == 4;
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    setLobbyCode(e.target.value);
    console.log(e.target.value, lobbyCode);
  }

  const onClick = () => {
    if (isValid())
    {
      dispatch(joinLobby(lobbyCode!));
    }
  }

  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle title="Join" subTitle="Join an existing lobby" />
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Lobby code"
                    id="lobby-code"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={lobbyCode}
                    onChange={(e) => handleChange(e)}
                    error={!isValid()}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={onClick}>Join</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
}