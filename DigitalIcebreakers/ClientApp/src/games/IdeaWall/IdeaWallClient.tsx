import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';
import ContentContainer from '../../components/ContentContainer';
import Grid from "@material-ui/core/Grid";
import Card from '../../layout/components/Card/Card';
import CardBody from '../../layout/components/Card/CardBody';
import CardFooter from '../../layout/components/Card/CardFooter';
import CardTitle from '../../layout/components/Card/CardTitle';
import CustomInput from '../../layout/components/CustomInput/CustomInput';
import Button from '../../layout/components/CustomButtons/Button';
import { makeStyles } from '@material-ui/core/styles';

const MAX_CHARACTERS = 50;

const useStyles = makeStyles(theme => ({
    input: {
        margin: 0,
    },
}));

export const IdeaWallClient = () => {
    const [idea, setIdea] = useState<string>("");
    const dispatch = useDispatch();

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        if (target.value.split('\n').length <= 4 && target.value.length < MAX_CHARACTERS)
            setIdea(target.value);
    }

    const onClick = (e: React.SyntheticEvent<EventTarget>) => {
        if (idea.length) {
            dispatch(clientMessage(idea));
            setIdea("");
        }
    }

    const classes = useStyles();

    return (
        <ContentContainer>
            <Grid container>
                <Grid item xs={12} sm={12} md={8}>
                <Card>
                    <CardTitle title="Your idea" subTitle="Add your idea to the board" />
                        <CardBody>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={6}>
                                    <CustomInput
                                        multiline
                                        rows={4}
                                        id='idea-value'
                                        labelText={`Your idea (${idea.length}/${MAX_CHARACTERS})`}
                                        formControlProps={{
                                            className: classes.input,
                                            fullWidth: true,
                                        }}
                                        value={idea}
                                        onChange={onChange}
                                    />
                                </Grid>
                            </Grid>
                        </CardBody>
                    <CardFooter>
                        <Button color="primary" onClick={onClick}>Send</Button>
                    </CardFooter>
                </Card>
                </Grid>
            </Grid>
        </ContentContainer>
    );
}
//         <Form>
//             <FormGroup>
                
//                 <FormControl maxLength={MAX_CHARACTERS} componentClass="textarea" rows={3} onChange={onChange} value={idea} />
//             </FormGroup>
//             <Button onClick={onClick} bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
//                 Submit
//             </Button>
//         </Form>
//     );
// }
