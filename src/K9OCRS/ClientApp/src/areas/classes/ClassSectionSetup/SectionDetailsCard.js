import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Badge, Col, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead';
import ProfileBadge from 'src/shared/components/ProfileBadge';

const SectionDetailsCard = (props) => {
    const {
        loading,
        loadingOptions,
        isCreatingNewSection,
        submitting,
        typeOptions,
        classTypeSelections,
        setClassTypeSelections,
        instructorOptions,
        instructorSelections,
        setInstructorSelections,
        rosterCapacity,
        setRosterCapacity,
        details,
    } = props;

    const typeRenderMenuItemChildren = (option, { text }, index) => (
        <Fragment>
            <Highlighter key={index} search={text}>
                {`${option.title} ${option.isArchived ? '- [Archived]' : ''}`}
            </Highlighter>
        </Fragment>
    );

    const typeLabelKey = (option) =>
        loadingOptions
            ? 'Loading...'
            : `${option.title} ${option.isArchived ? '- [Archived]' : ''}`;

    const instructorRenderMenuItemChildren = (option, { text }, index) => (
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
                <Col>
                    {option.isMember && (
                        <Badge color="info" className="me-1">
                            Member
                        </Badge>
                    )}
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

    const instructorLabelKey = (option) => {
        if (loadingOptions) return 'Loading...';

        const attributes = [];
        if (option.isMember) attributes.push('Member');
        if (option.isArchived) attributes.push('Archived');

        const attributesString = JSON.stringify(attributes).replace(/"/g, '');

        return `${option.firstName} ${option.lastName} ${
            attributes.length > 0 ? attributesString : ''
        }`;
    };

    return (
        <div className="cardsurface">
            <FormGroup>
                <Label>Class Type</Label>
                <Typeahead
                    id="ClassTypesTypeahead"
                    labelKey={typeLabelKey}
                    placeholder="Choose a class type..."
                    selected={classTypeSelections}
                    onChange={setClassTypeSelections}
                    disabled={submitting}
                    options={typeOptions}
                    renderMenuItemChildren={typeRenderMenuItemChildren}
                    flip
                    clearButton
                    positionFixed
                />
            </FormGroup>
            <FormGroup>
                <Label>Instructor</Label>
                <Typeahead
                    id="InstructorsTypeahead"
                    labelKey={instructorLabelKey}
                    placeholder="Choose an Instructor..."
                    selected={instructorSelections}
                    onChange={setInstructorSelections}
                    disabled={submitting}
                    options={instructorOptions}
                    renderMenuItemChildren={instructorRenderMenuItemChildren}
                    flip
                    clearButton
                    positionFixed
                />
            </FormGroup>
            <FormGroup>
                <Label>Roster Capacity</Label>
                <Input
                    type="number"
                    name="rosterCapacity"
                    value={rosterCapacity}
                    onChange={(e) => setRosterCapacity(e.target.value)}
                    min={loading || isCreatingNewSection ? 0 : details?.rosterActual}
                    max="9999"
                />
                {!(loading || isCreatingNewSection) && (
                    <FormText>Currently Enrolled: {details?.rosterActual}</FormText>
                )}
            </FormGroup>
        </div>
    );
};

SectionDetailsCard.propTypes = {
    loading: PropTypes.bool.isRequired,
    loadingOptions: PropTypes.bool.isRequired,
    isCreatingNewSection: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    typeOptions: PropTypes.array.isRequired,
    classTypeSelections: PropTypes.array.isRequired,
    setClassTypeSelections: PropTypes.func.isRequired,
    instructorOptions: PropTypes.array.isRequired,
    instructorSelections: PropTypes.array.isRequired,
    setInstructorSelections: PropTypes.func.isRequired,
    rosterCapacity: PropTypes.string.isRequired,
    setRosterCapacity: PropTypes.func.isRequired,
    details: PropTypes.object.isRequired,
};

export default SectionDetailsCard;
