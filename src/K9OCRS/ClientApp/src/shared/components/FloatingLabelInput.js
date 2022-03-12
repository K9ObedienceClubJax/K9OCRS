import React from 'react';
import { FormGroup, Input as RsInput, Label } from 'reactstrap';

const Input = (props) => {
    return (
        <FormGroup floating>
            <RsInput id={props.labelFor} {...props} />
            <Label for={props.labelFor}>{props.label}</Label>
        </FormGroup>
    );
};

export default Input;
