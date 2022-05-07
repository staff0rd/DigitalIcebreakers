import React, { useEffect, useState } from "react";
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer";
import CustomInput from "../layout/components/CustomInput/CustomInput";
import Button from "../layout/components/CustomButtons/Button";
import Card from "../layout/components/Card/Card";
import CardBody from "../layout/components/Card/CardBody";
import CardFooter from "../layout/components/Card/CardFooter";
import { useDispatch } from "react-redux";
import { joinLobby } from "../store/lobby/actions";
import CardTitle from "../layout/components/Card/CardTitle";
import { ContentContainer } from "./ContentContainer";
import { useParams } from "react-router";

interface RouteParams {
  id: string;
}

export default function Join() {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();

  const [lobbyCode, setLobbyCode] = useState<string>("");

  useEffect(() => {
    setLobbyCode(id || "");
    if (id) {
      join(id);
    }
  }, [id]);

  const isValid = (code: string | undefined) => {
    return code && code.trim().length === 4;
  };

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    setLobbyCode(e.target.value);
    console.log(e.target.value, lobbyCode);
  };

  const join = (lobbyCode: string | undefined) => {
    if (isValid(lobbyCode)) {
      dispatch(joinLobby(lobbyCode!));
    }
  };

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
                      fullWidth: true,
                    }}
                    value={lobbyCode}
                    onChange={(e) => handleChange(e)}
                    error={!isValid(lobbyCode)}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                data-testid="join-lobby"
                color="primary"
                onClick={() => join(lobbyCode)}
              >
                Join
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
}
