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
                setAlerts,
                redirect: (created) =>
                    historyInstance.push(`/Manage/Classes/Types/${created.id}`),
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

    const handleDelete = () =>
        deleteClassType({
            id: classTypeId,
            setAlerts,
            redirect: (created) => historyInstance.push('/Manage/Classes'),
        });

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
                    <Button
                        tag={Link}
                        to="/Manage/Classes"
                        color="secondary"
                        outline
                    >
                        Cancel
                    </Button>
                )}
                {!addingNewType && (
                    <Button
                        color="danger"
                        onClick={() => handleDelete()}
                        outline
                    >
                        Delete
                    </Button>
                )}
                <Button
                    color="primary"
                    disabled={submitting}
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
    }
)(ClassTypeSetup);
