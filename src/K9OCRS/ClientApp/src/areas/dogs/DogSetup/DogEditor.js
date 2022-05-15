/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment-timezone';
import ClassNames from 'classnames';
import { Row, Col, FormGroup, Label, Input, Badge } from 'reactstrap';
import { Typeahead, Token } from 'react-bootstrap-typeahead';
import FileDropzone from '../../../shared/components/FileDropzone';
import ProfileBadge from 'src/shared/components/ProfileBadge';
import ProfileFileDropzone from '../../../shared/components/FileDropzone/Profile';
import { BsFileEarmarkText } from 'react-icons/bs';
import { formatToServerDateTime } from 'src/util/dates';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';

const DogEditor = (props) => {
    const {
        loading,
        loadingOptions,
        submitting,
        dogDetails,
        ownerOptions,
        setData,
        formRef,
        userIsAdmin,
    } = props;

    const disableInputs = loading || submitting;

    // From our form
    const [profilePicture, setProfilePicture] = useState(null);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [vaccinationRecord, setVaccinationRecord] = useState(null);
    const [selectedOwners, setSelectedOwners] = useState([]);

    const cn = 'dogSetup__editor';

    // make reference data types to strings so useEffect can tell when to update
    const dogString = JSON.stringify(dogDetails);
    const profilePictureString = JSON.stringify(profilePicture);
    const vaccinationRecordString = JSON.stringify(vaccinationRecord);
    const selectedOwnersString = JSON.stringify(selectedOwners);

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
    }, [dogString]);

    useEffect(() => {
        const data = {
            id: dogDetails?.id,
            name,
            breed,
            dateOfBirth: dateOfBirth ? formatToServerDateTime(dateOfBirth) : '',
            image: profilePicture,
            vaccinationRecord,
            ownersIdsToInsert: selectedOwners?.map((o) => o.id),
        };
        setData(data);
    }, [
        setData,
        name,
        breed,
        dateOfBirth,
        profilePictureString,
        vaccinationRecordString,
        selectedOwnersString,
    ]);

    const vaxStatusCn = ClassNames(`${cn}__vax-status`);

    const ownerRenderMenuItemChildren = (option, { text }, index) => (
        <Fragment>
            <Row key={index}>
                <Col className="d-flex justify-content-start align-items-center">
                    <ProfileBadge
                        id={option.id}
                        imageUrl={option.profilePictureUrl}
                        firstName={option.firstName}
                        lastName={option.lastName}
                    />
                </Col>
                <Col className="d-flex justify-content-start align-items-center">
                    {option.isArchived && (
                        <Badge color="dark" className="me-1">
                            Archived
                        </Badge>
                    )}
                    <span />
                </Col>
            </Row>
        </Fragment>
    );

    const ownerRenderToken = (option, { onRemove }, index) => (
        <Token key={index} onRemove={onRemove} option={option}>
            <ProfileBadge
                id={option.id}
                imageUrl={option.profilePictureUrl}
                firstName={option.firstName}
                lastName={option.lastName}
            />
        </Token>
    );

    const ownerLabelKey = (option) =>
        loadingOptions
            ? 'Loading...'
            : `${option.firstName} ${option.lastName} ${option.isArchived ? '- [Archived]' : ''}`;

    return (
        <div>
            <LastUpdatedNote
                modifiedByID={dogDetails?.modifiedByID}
                modifiedByName={dogDetails?.modifiedByName}
                modifiedDate={dogDetails?.modifiedDate}
            />
            {userIsAdmin && (
                <Row className="mb-3">
                    <Col>
                        <div className="cardsurface">
                            <FormGroup>
                                <Label>Owners</Label>
                                <Typeahead
                                    id="OwnersTypeahead"
                                    style={{ maxWidth: '500px' }}
                                    labelKey={ownerLabelKey}
                                    placeholder="Choose Owners..."
                                    selected={selectedOwners}
                                    onChange={setSelectedOwners}
                                    disabled={loadingOptions}
                                    options={ownerOptions}
                                    renderMenuItemChildren={ownerRenderMenuItemChildren}
                                    renderToken={ownerRenderToken}
                                    multiple
                                    flip
                                    clearButton
                                    positionFixed
                                />
                            </FormGroup>
                        </div>
                    </Col>
                </Row>
            )}
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
