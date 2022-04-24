import React, { useState } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'reactstrap';
import Input from '../../../shared/components/FloatingLabelInput';
import FileDropzone from '../../../shared/components/FileDropzone';
import ProfileFileDropzone from '../../../shared/components/FileDropzone/Profile';
import FileThumbnail from '../../../shared/components/FileThumbnail';
import { useReducer } from 'react';
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
            <Row className={`${cn}__container`}>
                <Col className='dogCard'>
                    <Col className='profilePicZone'>
                        <ProfileFileDropzone
                                maxSize="5MB"
                                maxFiles={1}
                                onChange={(files) => setPictureToUpdate(files[0])}
                                currentImage={dog?.picture}
                            />
                    </Col>
                </Col>
            </Row>
            {/* <Row className={`${cn}__top`}>
                <Col className="d-flex" xs="12" md="5" lg="4" xl="3">
                    <ProfileFileDropzone
                        maxSize="5MB"
                        maxFiles={1}
                        onChange={(files) => setImageToUpdate(files[0])}
                        currentImage={classType?.imageUrl}
                    />
                </Col>
                <Col
                    className="d-flex flex-column"
                    xs="12"
                    md="7"
                    lg="8"
                    xl="9"
                >
                    <Row className="g-2" xs="1" sm="1" md="3">
                        <Col md="5" lg="7">
                            <Input
                                type="text"
                                label="Title"
                                labelFor="Title"
                                className="mb-2"
                                value={classTypeDetails?.title}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'title',
                                        payload: e.target.value,
                                    })
                                }
                                required
                            />
                        </Col>
                        <Col md="5" lg="3">
                            <Input
                                type="text"
                                label="Estimated Length"
                                labelFor="EstimatedLength"
                                className="mb-2"
                                helpText={'for example: "7 weeks"'}
                                value={classTypeDetails?.duration}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'duration',
                                        payload: e.target.value,
                                    })
                                }
                                pattern="^\d+\s[A-Z-a-z]+.*$"
                                required
                            />
                        </Col>
                        <Col md="2" lg="2">
                            <Input
                                type="number"
                                label="Price"
                                labelFor="Price"
                                className="mb-2"
                                value={classTypeDetails?.price}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'price',
                                        payload: e.target.value,
                                    })
                                }
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="g-2">
                        <Input
                            type="text"
                            label="Requirements"
                            labelFor="Requirements"
                            className="mb-2"
                            value={classTypeDetails?.requirements}
                            onChange={(e) =>
                                dispatch({
                                    type: 'requirements',
                                    payload: e.target.value,
                                })
                            }
                        />
                    </Row>
                    <Row className="g-2">
                        <Input
                            type="textarea"
                            label="Description"
                            labelFor="Description"
                            className="mb-2"
                            rows="15"
                            value={classTypeDetails?.description}
                            onChange={(e) =>
                                dispatch({
                                    type: 'description',
                                    payload: e.target.value,
                                })
                            }
                            style={{ minHeight: '250px' }}
                            required
                        />
                    </Row>
                </Col>
            </Row>
            <section className={`${cn}__photos`}>
                <div className={`${cn}__photos-header`}>
                    <h3>Photos</h3>
                    {!addingNewType ? (
                        <Button
                            color="primary"
                            onClick={() => setShowPhotosAdd(true)}
                        >
                            Add More
                        </Button>
                    ) : null}
                </div>
                {showPhotosAdd ? (
                    <FileDropzone
                        maxSize="5MB"
                        onChange={(files) => setPhotosToAdd(files)}
                        bordered
                    />
                ) : null}
                {photos?.map((p, idx) => (
                    <FileThumbnail
                        key={p.id}
                        src={p.imageUrl}
                        handleRemove={() => handleRemove(p, idx)}
                        removable
                    />
                ))}
            </section> */}
        </form>
    );
};

export default DogEditor;
