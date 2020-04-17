import React, { useState } from "react";
import { useSelector } from '../store/useSelector';
import { setUserName } from '../store/user/actions';
import { joinLobby } from '../store/lobby/actions';
import { goToDefaultUrl } from '../store/shell/actions';
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer.js";
import CustomInput from "../layout/components/CustomInput/CustomInput";
import Button from "../layout/components/CustomButtons/Button";
import Card from "../layout/components/Card/Card.js";
import CardBody from "../layout/components/Card/CardBody.js";
import CardFooter from "../layout/components/Card/CardFooter.js";
import { useDispatch } from "react-redux";
import CardTitle from '../layout/components/Card/CardTitle';
import { useParams } from 'react-router-dom';
import ContentContainer from '../components/ContentContainer';

interface RouteParams {
  id: string;
}

export default function JoinLobby() {
  const initialName = useSelector(state => state.user.name || "");
  const [name, setName] = useState<string>(initialName);
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();

  const isValid = () => {
    return name.trim().length > 2;
  }

  const onSubmit = (e:any) => {
    if (isValid()) {
        dispatch(setUserName(name));
        dispatch(joinLobby(params.id));
        dispatch(goToDefaultUrl(true));
    }
  }

  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle title="Join lobby" subTitle="How would you like to be known?" />
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="User name"
                    id="user-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!isValid()}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={onSubmit}>Join</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
}