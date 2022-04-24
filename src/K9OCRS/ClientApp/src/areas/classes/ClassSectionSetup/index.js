import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Col, Row, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import PageBody from '../../../shared/components/PageBody';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';
import * as actions from '../modules/actions';
import SectionDetailsCard from './SectionDetailsCard';
import SectionScheduleCard from './SectionScheduleCard';

import './styles.scss';

const ClassTypeSetup = (props) => {
    const {
        loading,
        loadingOptions,
        submitting,
        details,
        typeOptions,
        instructorOptions,
        initAddition,
        getData,
        getOptions,
        saveChanges,
    } = props;

    const historyInstance = useHistory();
    const { classSectionId } = useParams();
    const isCreatingNewSection = !classSectionId;
    const cn = 'classSectionSetup';

    const [alerts, setAlerts] = useState([]);
    const [isDraft, setIsDraft] = useState(false);
    const [rosterCapacity, setRosterCapacity] = useState(0);
    const [classTypeSelections, setClassTypeSelections] = useState([]);
    const [instructorSelections, setInstructorSelections] = useState([]);
    const [meetingsToInsert, setMeetingsToInsert] = useState([]);
    const [meetingIdsToDelete, setMeetingIdsToDelete] = useState([]);
    // Current meetings (already existing and new - deleted)
    const [meetings, setMeetings] = useState([]);

    // Including the bogus id would cause errors
    const sanitizedMeetingsToInsert = meetingsToInsert.map((m) => ({ ...m, id: undefined }));

    const data = {
        id: details?.id,
        classTypeID: classTypeSelections[0]?.id,
        rosterCapacity: parseInt(rosterCapacity),
        instructorID: instructorSelections[0]?.id,
        meetings: !isCreatingNewSection ? undefined : sanitizedMeetingsToInsert,
        meetingIdsToDelete,
        meetingsToInsert: sanitizedMeetingsToInsert,
        isDraft,
    };

    useEffect(() => {
        if (isCreatingNewSection) {
            initAddition();
        } else {
            getData({ sectionId: classSectionId, setAlerts });
        }

        getOptions();
    }, [classSectionId, getData, setAlerts]); // eslint-disable-line

    const detailsString = JSON.stringify(details);
    const typeOptionsString = JSON.stringify(typeOptions);
    const instructorOptionsString = JSON.stringify(instructorOptions);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            if (typeOptions?.length > 0) {
                setClassTypeSelections(typeOptions?.filter((t) => t.id === details?.classType?.id));
            }
            if (instructorOptions?.length > 0) {
                setInstructorSelections(
                    instructorOptions?.filter((i) => i.id === details?.instructor?.id)
                );
            }
            if (details?.rosterCapacity >= 0) {
                setRosterCapacity(details?.rosterCapacity);
            }

            if (details?.meetings) {
                setMeetings(details?.meetings);
            }

            if (details?.isDraft !== undefined) {
                setIsDraft(details?.isDraft);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [detailsString, typeOptionsString, instructorOptionsString]); // eslint-disable-line

    const sectionTitle = loading ? 'Loading...' : `${details?.id} - ${details?.classType?.title}`;

    return (
        <div className={cn}>
            <PageHeader
                title={
                    !isCreatingNewSection ? `Class Section: ${sectionTitle}` : 'Class Section Setup'
                }
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Classes', path: '/Manage/Classes' },
                    {
                        label: !isCreatingNewSection
                            ? `Class Section: ${sectionTitle}`
                            : 'Class Section Setup',
                        active: true,
                    },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                {isCreatingNewSection && (
                    <Button tag={Link} to="/Manage/Classes" color="secondary" outline>
                        Cancel
                    </Button>
                )}
                {!isCreatingNewSection && (
                    <Button
                        color="danger"
                        disabled={loading || submitting}
                        onClick={() => {}}
                        outline
                    >
                        Delete
                    </Button>
                )}
                <Button
                    color="primary"
                    disabled={loading || submitting}
                    onClick={() =>
                        saveChanges({
                            creating: isCreatingNewSection,
                            data,
                            setAlerts,
                            redirect: (createdId) =>
                                historyInstance.push(`/Manage/Classes/Sections/${createdId}`),
                        })
                    }
                >
                    {submitting ? (
                        <>
                            Saving Changes
                            <Spinner className="ms-3" size="sm" />
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </PageHeader>
            <PageBody className="pb-5">
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        {!isCreatingNewSection && (
                            <LastUpdatedNote
                                modifiedByID={details?.modifiedByID}
                                modifiedByName={details?.modifiedByName}
                                modifiedDate={details?.modifiedDate}
                            />
                        )}
                        <Row lg="2" xs="1">
                            <Col xxl="3" xl="4" lg="5">
                                <SectionDetailsCard
                                    loading={loading}
                                    loadingOptions={loadingOptions}
                                    isCreatingNewSection={isCreatingNewSection}
                                    submitting={submitting}
                                    typeOptions={typeOptions}
                                    classTypeSelections={classTypeSelections}
                                    setClassTypeSelections={setClassTypeSelections}
                                    instructorOptions={instructorOptions}
                                    instructorSelections={instructorSelections}
                                    setInstructorSelections={setInstructorSelections}
                                    rosterCapacity={rosterCapacity}
                                    setRosterCapacity={setRosterCapacity}
                                    isDraft={isDraft}
                                    setIsDraft={setIsDraft}
                                    details={details}
                                />
                            </Col>
                            <Col xxl="9" xl="8" lg="7">
                                <SectionScheduleCard
                                    loading={loading}
                                    isCreatingNewSection={isCreatingNewSection}
                                    submitting={submitting}
                                    meetings={meetings}
                                    setMeetings={setMeetings}
                                    meetingsToInsert={meetingsToInsert}
                                    setMeetingsToInsert={setMeetingsToInsert}
                                    meetingIdsToDelete={meetingIdsToDelete}
                                    setMeetingIdsToDelete={setMeetingIdsToDelete}
                                />
                            </Col>
                        </Row>
                    </>
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => {
        const pageState = state.classes;
        const section = pageState?.section;
        return {
            loading: section?.loading,
            submitting: section?.submitting,
            details: section?.details,
            loadingOptions: pageState?.loadingOptions,
            typeOptions: pageState?.typeOptions,
            instructorOptions: pageState?.instructorOptions,
        };
    },
    {
        initAddition: actions.initializeSectionAddition,
        getData: actions.fetchSectionDetails,
        getOptions: actions.fetchOptions,
        saveChanges: actions.saveSectionChanges,
    }
)(ClassTypeSetup);
