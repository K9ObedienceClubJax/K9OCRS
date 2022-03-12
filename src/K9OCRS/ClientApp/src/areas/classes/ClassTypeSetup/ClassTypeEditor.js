import React, { useState } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'reactstrap';
import Input from '../../../shared/components/FloatingLabelInput';
import FileDropzone from '../../../shared/components/FileDropzone';
import FileThumbnail from '../../../shared/components/FileThumbnail';
import { useReducer } from 'react';

const reducer = (state, action) => ({
    ...state,
    [action.type]: action.payload,
});

const ClassTypeEditor = (props) => {
    const { classType, setData, addingNewType } = props;

    const initialState = {
        title: classType.title,
        duration: classType.duration,
        price: classType.price,
        requirements: classType.requirements,
        description: classType.description,
    };

    const [classTypeDetails, dispatch] = useReducer(reducer, initialState);

    const [photos, setPhotos] = useState(classType?.photos);

    const [photosToAdd, setPhotosToAdd] = useState([]);
    const [photosToRemove, setPhotosToRemove] = useState([]);

    const [showPhotosAdd, setShowPhotosAdd] = useState(addingNewType);

    const cn = 'classTypeSetup__editor';

    // Update the data object that will be saved
    useEffect(() => {
        setData({
            ...classTypeDetails,
            photosToAdd,
            photosToRemove,
        });
    }, [setData, classTypeDetails, photosToAdd, photosToRemove]);

    const handleRemove = (photo, idx) => {
        setPhotos((currentPhotos) => currentPhotos.filter((p, i) => i !== idx));
        setPhotosToRemove(photosToRemove.concat(photo));
    };

    return (
        <>
            <div>
                <div></div>
                <form className="d-flex flex-column">
                    <Row className="g-2" xs="1" sm="1" md="3">
                        <Col md="7">
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
                            />
                        </Col>
                        <Col md="3">
                            <Input
                                type="text"
                                label="Session Length"
                                labelFor="SessionLength"
                                className="mb-2"
                                value={classTypeDetails?.duration}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'duration',
                                        payload: e.target.value,
                                    })
                                }
                            />
                        </Col>
                        <Col md="2">
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
                        />
                    </Row>
                </form>
            </div>
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
            </section>
        </>
    );
};

ClassTypeEditor.propTypes = {
    classType: PropTypes.object.isRequired,
    setData: PropTypes.func.isRequired,
};

export default ClassTypeEditor;
