import React from 'react'
import {Container, FormGroup, Label, Input, Button} from 'reactstrap'


const index = () => {
    return (
        <Container>
            <h1>Dog Registration</h1>
            <FormGroup>
                <Label for="dogName">
                    Name
                </Label>
                <Input 
                    id="dogName"
                    name="text"
                    type="text"
                    placeholder="'Spike'"
                    />
            </FormGroup>
            <FormGroup>
                <Label for="dogBreed">
                    Dog Breed
                </Label>
                <Input 
                    id="dogBreedInput"
                    name="text"
                    type="text"
                    placeholder="'Golden Retriever'"
                    />
            </FormGroup>
            <FormGroup>
                <Label for="dogDateOfBirth">
                    Date of Birth
                </Label>
                <Input
                    id="dogDateOfBirth"
                    name="date"
                    type="date"
                    />
            </FormGroup>
            <FormGroup>
                <Label for="fileUpload">
                    Vaccination records
                </Label>
                <Input
                    id="fileUpload"
                    name="file"
                    type="file"
                />
            </FormGroup>
            <FormGroup>
                <Label for="pictureUpload">
                    Profile Picture
                </Label>
                <Input
                    id="pictureUpload"
                    name="file"
                    type="file"
                />
            </FormGroup>
            
            <Button type="cancel">Cancel</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="submit">Submit</Button>
        </Container>
    )
}

export default index
