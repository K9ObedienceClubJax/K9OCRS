/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment-timezone';
import { Row, Col, FormGroup, Label, Input, Badge, FormText } from 'reactstrap';
import { Typeahead, Token } from 'react-bootstrap-typeahead';
import FileDropzone from '../../../shared/components/FileDropzone';
import FileThumbnail from '../../../shared/components/FileThumbnail';
import ProfileBadge from 'src/shared/components/ProfileBadge';
import ProfileFileDropzone from '../../../shared/components/FileDropzone/Profile';
import {
    BsFileEarmarkText,
    BsCircleFill,
} from 'react-icons/bs';
import { formatDogAge, formatToServerDateTime } from 'src/util/dates';
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
    const [selectedOwners, setSelectedOwners] = useState([]);
    const [existingOwnerIds, setExistingOwnerIds] = useState([]);
    const [ownersToInsert, setOwnersToInsert] = useState([]);
    const [ownersToDelete, setOwnersToDelete] = useState([]);
    const [vaccinationRecords, setVaccinationRecords] = useState([]);
    const [vaccinationRecordsToAdd, setVaccinationRecordsToAdd] = useState([]);
    const [vaccinationRecordsToRemove, setVaccinationRecordsToRemove] = useState([]);
    const selectedOwnerIds = selectedOwners?.map((o) => o.id);
    const emptyOwnersField = selectedOwnerIds?.length < 1;

    const handleSelectedOwnersChanged = (owners) => {
        const postChangeOwnerIds = owners?.map((o) => o.id);
        const toDelete = dogDetails?.owners?.filter((o) => !postChangeOwnerIds?.includes(o.id));
        const newlyAddedOwners = owners?.filter((o) => !existingOwnerIds?.includes(o.id));
        setSelectedOwners(owners);
        setOwnersToInsert(newlyAddedOwners);
        setOwnersToDelete(toDelete);
    };

    const cn = 'dogSetup__editor';

    // make reference data types to strings so useEffect can tell when to update
    const dogString = JSON.stringify(dogDetails);
    const profilePictureString = JSON.stringify(profilePicture);
    const vaccinationRecordsToAddString = JSON.stringify(vaccinationRecordsToAdd);
    const vaccinationRecordsToRemoveString = JSON.stringify(vaccinationRecordsToRemove);
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
            setSelectedOwners(dogDetails?.owners);
            setExistingOwnerIds(dogDetails?.owners?.map((o) => o.id));
            setVaccinationRecords(dogDetails?.vaccinationRecords);
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
            vaccinationRecordsToAdd,
            vaccinationRecordsToRemove,
            ownersIdsToInsert: ownersToInsert?.map((o) => o.id),
            ownersIdsToDelete: ownersToDelete?.map((o) => o.id),
            selectedOwnerIds,
        };
        setData(data);
    }, [
        setData,
        name,
        breed,
        dateOfBirth,
        profilePictureString,
        vaccinationRecordsToAddString,
        vaccinationRecordsToRemoveString,
        selectedOwnersString,
    ]);

    const handleRemove = (vaccinationRecord, idx) => {
        setVaccinationRecords((currentVaccinationRecords) => currentVaccinationRecords.filter((p, i) => i !== idx));
        setVaccinationRecordsToRemove(vaccinationRecordsToRemove.concat(vaccinationRecord));
    };

    const ownerRenderMenuItemChildren = (option, { text }, index) => {
        const display = selectedOwnerIds?.includes(option.id) ? 'none' : undefined;
        return (
            <Fragment>
                <Row key={index} style={{ display }}>
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
    };

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
                                <Label>Owners *</Label>
                                <Typeahead
                                    id="OwnersTypeahead"
                                    style={{ maxWidth: '500px' }}
                                    labelKey={ownerLabelKey}
                                    placeholder="Choose Owners..."
                                    selected={selectedOwners}
                                    onChange={handleSelectedOwnersChanged}
                                    disabled={loadingOptions}
                                    options={ownerOptions}
                                    renderMenuItemChildren={ownerRenderMenuItemChildren}
                                    renderToken={ownerRenderToken}
                                    multiple
                                    flip
                                    clearButton
                                    positionFixed
                                />
                                {emptyOwnersField && (
                                    <FormText>There must be at least one owner</FormText>
                                )}
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
                                <Label>Name *</Label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={disableInputs}
                                    required
                                ></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Breed *</Label>
                                <Input
                                    type="text"
                                    value={breed}
                                    onChange={(e) => setBreed(e.target.value)}
                                    disabled={disableInputs}
                                    required
                                ></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Date of Birth *</Label>
                                <Input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    disabled={disableInputs}
                                    required
                                ></Input>
                                {dateOfBirth && (
                                    <FormText>Age: {formatDogAge(dateOfBirth)}</FormText>
                                )}
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
                                    Vaccination Records
                                </span>
                            </h3>
                        </div>
                        <p>
                            Upload your dog's vaccination records. The icon to the left of your uploaded records means the following: <br/>
                            <BsCircleFill className='text-info' /> pending review, <BsCircleFill className='text-success' /> approved,&nbsp;
                            <BsCircleFill className='text-warning' /> expired
                        </p>
                        <FileDropzone
                            maxSize="10MB"
                            maxFiles={10}
                            accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            acceptText="any image, .pdf, .doc, .docx"
                            onChange={(files) => setVaccinationRecordsToAdd(files)}
                            bordered
                        />
                        {vaccinationRecords?.map((vr, idx) => (
                            <FileThumbnail
                                key={vr.id}
                                src={vr.fileUrl}
                                data={vr}
                                handleRemove={() => handleRemove(vr, idx)}
                                removable
                                showApprovalStatus
                            />
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DogEditor;
