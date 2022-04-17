import React, { useEffect, useState, useRef } from 'react'
import {connect} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
//import DeleteModal from './DeleteModal';

const cn = 'dogSetup';

const DogSetup = (props) => {
    const {
        dogName,
        dogBreed,
        dogBirthDay,
        init,
        saveNewDog,
        updateDog,
        deleteDog,
        archiveDog,
        unarchiveDog,
    } = props;

    const historyInstance = useHistory();
    const { dogId } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    const [data, setData] = useState(null);

    const addingNewDog = !dogId;
    const formRef = useRef(null);

    const handleSubmit = () => {
        setSubmitting(true);
        if (addingNewDog) {
            saveNewDog({
                ...data,
                setSubmitting,
                setLoading,
                setAlerts,
                redirect: (created) => historyInstance.push(`/Account/MyDogs/${created.id}`),
            });
        } else {
            updateDog({
                ...data,
                setSubmitting,
                setLoading,
                setAlerts,
            });
        }
    };

    const requestFormSubmit = () => {
        if(formRef.current.reportValidity()){
            handleSubmit()
        }
    }

    const handleDelete = (targetId) => {
        deleteDog({
            id: dogId,
            targetId,
            setAlerts,
            setSubmitting,
            redirect: () => historyInstance.push('/Manage/Classes'),
        });
    };

    const handleArchive = () => {
        if (
            window.confirm(
                "This class will be hidden from your list of dogs."
            )
        ) {
            archiveDog({
                dogId,
                setSubmitting,
                setLoading,
                setAlerts,
            });
        }
    };

    const handleUnarchive = () => {
        if (
            window.confirm(
                'This dog will be shown on your list of dogs.'
            )
        ) {
            unarchiveDog({
                dogId,
                setSubmitting,
                setLoading,
                setAlerts,
            });
        }
    };


    const dogSetup = () => {
        return (
            <div className={cn}>
                <PageHeader
                    title={
                        !addingNewDog
                            ? `Dog: ${dogName?.title ?? 'Loading...'}`
                            : 'Dog Setup'
                    }
                    breadCrumbItems={[
                        { label: 'Account', path: '/Account' },
                        { label: 'My Dogs', path: '/Account/MyDogs' },
                        { label: 'Dog Setup', path:'/Account/MyDogs/Add'},
                        {
                            label: !addingNewDog
                                ? `Dog: ${dogName?.title ?? 'Loading...'}`
                                : 'Dog Setup',
                            active: true,
                        },
                    ]}
                    alerts={alerts}
                    setAlerts={setAlerts}
                >
                    {addingNewDog && (
                        <Button tag={Link} to="/Account/MyDogs" color="secondary" outline>
                            Cancel
                        </Button>
                    )}
                    {!addingNewDog && (
                        <>
                            <Button
                                color="danger"
                                disabled={loading || submitting}
                                onClick={() => toggleDeleteModal()}
                                outline
                            >
                                Delete
                            </Button>
                            {!loading && !dogName?.isArchived ? (
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
                        onClick={requestFormSubmit}
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
            </div>
        )
    }
}

export default connect(
    (state) => ({
        classType: state.classes?.classDetails,
    }),
    {
        // fetchClassDetails: actions.fetchClassDetails,
        // init: actions.initializeTypeAddition,
        // saveNewClassType: actions.saveNewClassType,
        // updateClassType: actions.updateClassType,
        // deleteClassType: actions.deleteClassType,
        // archiveClassType: actions.archiveClassType,
        // unarchiveClassType: actions.unarchiveClassType,
    }
)(DogSetup);
