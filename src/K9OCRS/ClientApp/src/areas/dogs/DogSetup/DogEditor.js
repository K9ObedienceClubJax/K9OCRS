import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import ClassNames from 'classnames';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import FileDropzone from '../../../shared/components/FileDropzone';
import ProfileFileDropzone from '../../../shared/components/FileDropzone/Profile';
import { BsFileEarmarkText, BsXLg } from 'react-icons/bs';
import { formatToServerDateTime } from 'src/util/dates';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';

const DogEditor = (props) => {
    const { loading, submitting, dogDetails, setData, formRef } = props;

    const disableInputs = loading || submitting;

    // From our form
    const [profilePicture, setProfilePicture] = useState(null);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [vaccinationRecord, setVaccinationRecord] = useState(null);

    const cn = 'dogSetup__editor';

    // make reference data types to strings so useEffect can tell when to update
    const dogString = JSON.stringify(dogDetails);
    const profilePictureString = JSON.stringify(profilePicture);
    const vaccinationRecordString = JSON.stringify(vaccinationRecord);

    // Populate fields if we get data
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setName(dogDetails?.name);
            setBreed(dogDetails?.breed);
            setDateOfBirth(
                dogDetails?.dateOfBirth ? moment(dogDetails?.dateOfBirth).format('YYYY-MM-DD') : ''
            );
        }

        return () => {
            isMounted = false;
        };
    }, [dogString]); // eslint-disable-line

    useEffect(() => {
        const data = {
            id: dogDetails?.id,
            name,
            breed,
            dateOfBirth: dateOfBirth ? formatToServerDateTime(dateOfBirth) : '',
            image: profilePicture,
            vaccinationRecord,
        };
        setData(data);
    }, [setData, name, breed, dateOfBirth, profilePictureString, vaccinationRecordString]); // eslint-disable-line

    //implement handleRemove function

    const vaxStatusCn = ClassNames(`${cn}__vax-status`);

    return (
        <div>
            <LastUpdatedNote
                modifiedByID={dogDetails?.modifiedByID}
                modifiedByName={dogDetails?.modifiedByName}
                modifiedDate={dogDetails?.modifiedDate}
            />
            <Row className={`${cn} gy-3`} lg="2" xs="1">
                <Col xxl="4" xl="5" lg="6">
                    <div className="cardsurface">
                        <div className={`${cn}__profile-picture`}>
                            <ProfileFileDropzone
                                className="profilePicZone"
                                maxSize="5MB"
                                maxFiles={1}
                                onChange={(files) => setProfilePicture(files[0])}
                                currentImage={dogDetails?.profilePictureUrl}
                                round
                            />
                        </div>
                        <form ref={formRef}>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={disableInputs}
                                    required
                                ></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Breed</Label>
                                <Input
                                    type="text"
                                    value={breed}
                                    onChange={(e) => setBreed(e.target.value)}
                                    disabled={disableInputs}
                                    required
                                ></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    disabled={disableInputs}
                                    required
                                ></Input>
                            </FormGroup>
                        </form>
                    </div>
                </Col>
                <Col xxl="8" xl="7" lg="6">
                    <div className="cardsurface">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="d-flex align-items-center">
                                <BsFileEarmarkText size={42} />
                                <span>
                                    Vaccination Record -{' '}
                                    <span className={vaxStatusCn}>Approved</span>
                                </span>
                            </h3>
                            <Button color="danger" disabled={disableInputs} outline>
                                Remove Current File <BsXLg />
                            </Button>
                        </div>
                        <FileDropzone
                            maxSize="5MB"
                            maxFiles={1}
                            accept="application/pdf, image/jpeg,image/png,image/bmp"
                            acceptText="pdf, jpg, png, bmp"
                            onChange={(files) => setVaccinationRecord(files[0])}
                            bordered
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DogEditor;
