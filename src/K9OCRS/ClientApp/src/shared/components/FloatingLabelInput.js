import React from 'react';
import { FormGroup, Input as RsInput, Label } from 'reactstrap';

const Input = (props) => {
    const { label, labelFor, ...rest } = props;

    return (
        <FormGroup floating>
            <RsInput id={labelFor} {...rest} placeholder={label} />
            <Label for={labelFor}>{label}</Label>
        </FormGroup>
    );
};

export default Input;
