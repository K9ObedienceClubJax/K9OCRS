import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Badge, Button, Col, FormGroup, FormText, Input, Label, Row, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import PageBody from '../../../shared/components/PageBody';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';
import * as actions from '../modules/actions';
import SectionDetailsCard from './SectionDetailsCard';

const ClassTypeSetup = (props) => {
    const {
        loading,
        loadingOptions,
        submitting,
        details,
        typeOptions,
        instructorOptions,
        getData,
        getOptions,
    } = props;

    const { classSectionId } = useParams();
    const isCreatingNewSection = !classSectionId;
    const cn = 'classSectionSetup';

    const [alerts, setAlerts] = useState([]);
    const [classTypeSelections, setClassTypeSelections] = useState([]);
    const [instructorSelections, setInstructorSelections] = useState([]);
    const [rosterCapacity, setRosterCapacity] = useState(0);

    useEffect(() => {
        if (isCreatingNewSection) {
            // TODO: Initialize the section form
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

        if (isMounted && typeOptions?.length > 0) {
            setClassTypeSelections(typeOptions?.filter((t) => t.id === details?.classType?.id));
        }
        if (isMounted && instructorOptions?.length > 0) {
            setInstructorSelections(
                instructorOptions?.filter((i) => i.id === details?.instructor?.id)
            );
        }
        if (isMounted && details?.rosterCapacity > 0) {
            setRosterCapacity(details?.rosterCapacity);
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
                    <>
                        <Button
                            color="danger"
                            disabled={loading || submitting}
                            onClick={() => {}}
                            outline
                        >
                            Delete
                        </Button>
                        {!loading && !details?.isDraft ? (
                            <Button
                                color="secondary"
                                disabled={loading || submitting}
                                onClick={() => {}}
                            >
                                Make Draft
                            </Button>
                        ) : (
                            <Button
                                color="secondary"
                                disabled={loading || submitting}
                                onClick={() => {}}
                            >
                                Publish Draft
                            </Button>
                        )}
                    </>
                )}
                <Button
                    color="primary"
                    disabled={loading || submitting}
                    // onClick={requestFormSubmit}
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
                        <LastUpdatedNote
                            modifiedByID={details.modifiedByID}
                            modifiedByName={details.modifiedByName}
                            modifiedDate={details.modifiedDate}
                        />
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
                                    details={details}
                                />
                            </Col>
                            <Col xxl="9" xl="8" lg="7"></Col>
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
        getData: actions.fetchSectionDetails,
        getOptions: actions.fetchOptions,
    }
)(ClassTypeSetup);
