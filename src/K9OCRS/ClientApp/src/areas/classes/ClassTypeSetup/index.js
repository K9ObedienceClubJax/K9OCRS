import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import ClassTypeEditor from './ClassTypeEditor';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';

import './styles.scss';

const ClassTypeSetup = (props) => {
    const {
        classType,
        fetchClassDetails,
        init,
        saveNewClassType,
        updateClassType,
        deleteClassType,
        archiveClassType,
        unarchiveClassType,
    } = props;

    const historyInstance = useHistory();
    const { classTypeId } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const [data, setData] = useState(null);

    const addingNewType = !classTypeId;

    useEffect(() => {
        if (addingNewType) {
            init({ setLoading });
        } else {
            fetchClassDetails({ classTypeId, setLoading, setAlerts });
        }
    }, [classTypeId]); // eslint-disable-line

    const cn = 'classTypeSetup';

    const formRef = useRef(null);

    const handleSubmit = () => {
        setSubmitting(true);
        if (addingNewType) {
            saveNewClassType({
                ...data,
                setSubmitting,
                setLoading,
                setAlerts,
                redirect: (created) => historyInstance.push(`/Manage/Classes/Types/${created.id}`),
            });
        } else {
            updateClassType({
                ...data,
                setSubmitting,
                setLoading,
                setAlerts,
            });
        }
    };

    const handleDelete = () => {
        var sectionsCount = classType?.sections?.length;
        if (sectionsCount > 0) {
            setAlerts([
                {
                    color: 'danger',
                    message: `This class type has ${sectionsCount} sections that must be reassigned before it can be deleted.`,
                },
            ]);
        } else if (
            window.confirm(
                "This action can't be reverted. This class type and all the photos related to it will be deleted."
            )
        ) {
            deleteClassType({
                id: classTypeId,
                setAlerts,
                redirect: () => historyInstance.push('/Manage/Classes'),
            });
        }
    };

    const handleArchive = () => {
        if (
            window.confirm(
                "This class will be hidden from the catalog and new sections won't be allowed to use this class type"
            )
        ) {
            archiveClassType({
                classTypeId,
                setSubmitting,
                setLoading,
                setAlerts,
            });
        }
    };

    const handleUnarchive = () => {
        if (
            window.confirm(
                'This class will be shown on the catalog and new sections will be allowed to use this class type'
            )
        ) {
            unarchiveClassType({
                classTypeId,
                setSubmitting,
                setLoading,
                setAlerts,
            });
        }
    };

    return (
        <div className={cn}>
            <PageHeader
                title={
                    !addingNewType
                        ? `Class Type: ${classType?.title ?? 'Loading...'}`
                        : 'Class Type Setup'
                }
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Classes', path: '/Manage/Classes' },
                    {
                        label: !addingNewType
                            ? `Class Type: ${classType?.title ?? 'Loading...'}`
                            : 'Class Type Setup',
                        active: true,
                    },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                {addingNewType && (
                    <Button tag={Link} to="/Manage/Classes" color="secondary" outline>
                        Cancel
                    </Button>
                )}
                {!addingNewType && (
                    <>
                        <Button
                            color="danger"
                            disabled={loading || submitting}
                            onClick={() => handleDelete()}
                            outline
                        >
                            Delete
                        </Button>
                        {!loading && !classType?.isArchived ? (
                            <Button
                                color="secondary"
                                disabled={loading || submitting}
                                onClick={() => handleArchive()}
                            >
                                Archive
                            </Button>
                        ) : (
                            <Button
                                color="secondary"
                                disabled={loading || submitting}
                                onClick={() => handleUnarchive()}
                            >
                                Unarchive
                            </Button>
                        )}
                    </>
                )}
                <Button
                    color="primary"
                    disabled={loading || submitting}
                    onClick={() => formRef.current.requestSubmit()}
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
            {loading ? (
                <Spinner />
            ) : (
                <ClassTypeEditor
                    classType={classType}
                    setData={setData}
                    addingNewType={addingNewType}
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default connect(
    (state) => ({
        classType: state.classes?.classDetails,
    }),
    {
        fetchClassDetails: actions.fetchClassDetails,
        init: actions.initializeTypeAddition,
        saveNewClassType: actions.saveNewClassType,
        updateClassType: actions.updateClassType,
        deleteClassType: actions.deleteClassType,
        archiveClassType: actions.archiveClassType,
        unarchiveClassType: actions.unarchiveClassType,
    }
)(ClassTypeSetup);
