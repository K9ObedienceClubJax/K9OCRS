import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import PageBody from '../../../shared/components/PageBody';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';
import * as actions from '../modules/actions';

const ClassTypeSetup = (props) => {
    const { loading, submitting, details, getData } = props;

    const { classSectionId } = useParams();
    const isCreatingNewSection = !classSectionId;
    const cn = 'classSectionSetup';

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (isCreatingNewSection) {
            // TODO: Initialize the section form
        } else {
            getData({ sectionId: classSectionId, setAlerts });
        }
    }, [classSectionId, getData, setAlerts]); // eslint-disable-line

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
            <PageBody>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <LastUpdatedNote
                            modifiedByID={details.modifiedByID}
                            modifiedByName={details.modifiedByName}
                            modifiedDate={details.modifiedDate}
                        />
                    </>
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => {
        const section = state.classes?.section;
        return {
            loading: section?.loading,
            submitting: section?.submitting,
            details: section?.details,
        };
    },
    {
        getData: actions.fetchSectionDetails,
    }
)(ClassTypeSetup);
