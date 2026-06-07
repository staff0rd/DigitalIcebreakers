import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "../store/atoms/userAtoms";
import { setUserNameAtom } from "../store/jotai/transportAtoms";
import GridItem from "../layout/components/Grid/GridItem";
import GridContainer from "../layout/components/Grid/GridContainer";
import CustomInput from "../layout/components/CustomInput/CustomInput";
import Button from "../layout/components/CustomButtons/Button";
import Card from "../layout/components/Card/Card";
import CardBody from "../layout/components/Card/CardBody";
import CardFooter from "../layout/components/Card/CardFooter";
import CardTitle from "../layout/components/Card/CardTitle";
import { ContentContainer } from "../components/ContentContainer";

const Register = () => {
  const initialName = useAtomValue(userAtom).name || "";
  const [name, setName] = useState<string>(initialName);
  const setUserName = useSetAtom(setUserNameAtom);

  const isValid = () => {
    return name.trim().length > 2;
  };

  const onSubmit = (e: any) => {
    if (isValid()) {
      // The reconnect that follows registration navigates to the right view;
      // navigating optimistically here races it and can override it
      setUserName(name);
    }
  };

  return (
    <ContentContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardTitle
              title="Join lobby"
              subTitle="How would you like to be known?"
            />
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="User name"
                    id="user-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!isValid()}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                color="primary"
                onClick={onSubmit}
                data-testid="join-lobby-button"
              >
                Join
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </ContentContainer>
  );
};
export default Register;
