import React, { useState } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, FormGroup, Form } from 'reactstrap';
import Input from '../../../shared/components/FloatingLabelInput';
import FileDropzone from '../../../shared/components/FileDropzone';
import FileThumbnail from '../../../shared/components/FileThumbnail';
import { useReducer } from 'react';
import ProfileFileDropzone from '../../../shared/components/FileDropzone/Profile';
import PageBody from '../../../shared/components/PageBody'

import './styles.scss';


const reducer = (state, action) => ({
    ...state,
    [action.type]: action.payload,
});

const DogEditor = (props) => {
    const { dog, formRef, handleSubmit, setData, addingNewDog } = props;

    const initialState = {
        name: addingNewDog ? '' : dog.name,
        breed: addingNewDog ? '' : dog.breed,
        dateOfBirth : addingNewDog ? '' : dog.dateOfBirth
    };

    const [dogDetails, dispatch] = useReducer(reducer, initialState);

    const [picture, setPicture] = useState(dog?.picture);
    const [modal, setModal] = useState('');

    const [pictureToUpdate, setPictureToUpdate] = useState(null);
    const [pictureToAdd, setPictureToAdd] = useState([]);
    const [pictureToRemove, setPictureToRemove] = useState([]);

    const [showPictureAdd, setShowPictureAdd] = useState([]);

    const cn = 'dogSetupEditor';

    useEffect(() => {
        if(addingNewDog){
            setData({
                picture: pictureToUpdate,
                ...dogDetails,
            });
        } else{
            setData({
                id: dog.id,
                picture: pictureToUpdate,
                ...dogDetails,
                pictureToAdd,
                pictureToRemove
            });
        }
        
    }, [
        setData,
        addingNewDog,
        pictureToUpdate,
        dogDetails,
        pictureToAdd,
        pictureToRemove,
        dog,
    ]);

    //implement handleRemove function


    return (
        <form
            ref={formRef}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <Row className='DogSetupContainer'>
            <Col className='DogCardInput' lg="2" md="4" sm="1">
                <Row className='profilePicZone'>
                    <ProfileFileDropzone
                        maxSize="5MB"
                        maxFiles={1}
                        onChange={(files) => setPictureToUpdate(files[0])}
                        currentImage={dog?.currentImage}
                    />
                </Row>
                <Row className='dogInputField'>
                    <FormGroup>
                        <Label for="dogNameInput">
                            Name
                        </Label>
                        <Input 
                            type="text"
                            id="dogNameInput"
                            label="e.g. 'Max'"
                            labelFor="Name"
                            value={dogDetails?.name}
                            onChange={(e) =>
                                dispatch({
                                    type: 'name',
                                    payload: e.target.value
                                })}
                            Required>
                        </Input>
                    </FormGroup>
                </Row>
                <Row className='dogInputField'>
                    <FormGroup>
                        <Label for="dogBreedInput">
                            Breed
                        </Label>
                        <Input 
                            type="text"
                            id="dogBreedInput"
                            label="e.g. 'Golden Retriever'"
                            labelFor="Breed"
                            value={dogDetails?.breed}
                            onChange={(e) =>
                                dispatch({
                                    type: 'breed',
                                    payload: e.target.value
                                })}
                            Required>
                        </Input>
                    </FormGroup>
                </Row>
                <Row className='dogInputField'>
                    <FormGroup>
                        <Label for="dateOfBirthInput">
                            Date of Birth
                        </Label>
                        <Input 
                            type="date"
                            name="date"
                            label="Date of Birth"
                            labelFor="dateOfBirth"
                            id="dateOfBirthInput"
                            value={dogDetails?.dateOfBirth}
                            onChange={(e) =>
                                dispatch({
                                    type: 'dateOfBirth',
                                    payload: e.target.value
                                })}
                            Required>
                        </Input>
                    </FormGroup>
                </Row>
            </Col>
            <Col className='fileDropZoneForDog' lg="8" md="6" sm="2">
                <Row>
                <h3>Vaccination Records</h3>
                    <FileDropzone
                        maxSize="5MB"
                        onChange={(files) => setPictureToAdd(files)}
                        bordered
                    />
                </Row>
            </Col>
            </Row>
            
        </form>
    );
};

export default DogEditor;
