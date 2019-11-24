import React, { useState } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import { useSelector } from '../store/useSelector';
import { RouteComponentProps } from 'react-router';

interface JoinProps {
    join: (id: string, name: string) => void;
}

interface RouteParams {
    id: string
}

export const Join: React.FC<JoinProps & RouteComponentProps<RouteParams>> = (props) => {
    const initialName = useSelector(state => state.user.name);

    const [name, setName] = useState<string>(initialName);

    const validate = () => {
        const length = name.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    const handleChange = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        setName(target.value);
    }

    const onSubmit = (e:any) => {
        if (validate() === "success") {
            props.join(props.match.params.id, name); 
        }      
        e.preventDefault();
    }


    return (
        <div>
            <h2>Join lobby</h2>
            <form onSubmit={onSubmit}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={validate()}
                >
                    <ControlLabel>How would you like to be known?</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="Enter text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>You must enter a name before you can join.</HelpBlock>
                    </FormGroup>
                    <Button bsStyle="primary" bsSize="large" onClick={onSubmit}>
                        Join
                    </Button>
            </form>
        </div>
    );
}