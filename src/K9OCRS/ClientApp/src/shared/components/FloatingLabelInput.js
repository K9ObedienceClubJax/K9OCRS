import React from 'react';
import { FormGroup, Input as RsInput, Label, FormText } from 'reactstrap';

const Input = (props) => {
    const { label, labelFor, helpText, ...rest } = props;

    return (
        <FormGroup floating>
            <RsInput id={labelFor} {...rest} placeholder={label} />
            <Label for={labelFor}>{label}</Label>
            {helpText && <FormText>{helpText}</FormText>}
        </FormGroup>
    );
};

export default Input;
