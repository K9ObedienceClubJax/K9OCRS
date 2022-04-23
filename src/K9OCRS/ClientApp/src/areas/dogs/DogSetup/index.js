import React, { useEffect, useState, useRef } from 'react'
import {connect} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';
import PageBody from '../../../shared/components/PageBody';
import DogEditor from '../DogSetup/DogEditor'
//import DeleteModal from './DeleteModal';

const cn = 'dogSetup';

const DogSetup = (props) => {
    const {
        dogName,
        fetchDogDetails,
        init,
        saveNewDog,
        updateDog,
        deleteDog,
    } = props;

    const addingNewDog = !fetchDogDetails;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [data, setData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
    const formRef = useRef(null);

    const historyInstance = useHistory();
    const { dogId } = useParams();

    useEffect(() => {
        if (addingNewDog) {
            init({ setLoading });
        } else {
            fetchDogDetails({ dogId, setLoading, setAlerts });
        }
    }, [dogId]); // eslint-disable-line


    const requestFormSubmit = () => {
        if(formRef.current.reportValidity()){
            handleSubmit()
        }
    }

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

    const handleDelete = (targetId) => {
        deleteDog({
            id: dogId,
            targetId,
            setAlerts,
            setSubmitting,
            redirect: () => historyInstance.push('/Account/MyDogs'),
        });
    };


    return (
        <div className={cn}>
            <PageHeader
                title={
                    !addingNewDog
                        ? `Dog Setup: ${dogName?.title ?? 'Loading...'}`
                        : 'Dog Setup'
                }
                breadCrumbItems={[
                    { label: 'My Account', path: '/Account' },
                    { label: 'My Dogs', path: '/Account/MyDogs' },
                    {
                        label: !addingNewDog
                            ? `Dog Setup: ${dogName?.title ?? 'Loading...'}`
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
            <PageBody>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <DogEditor
                            dogName={dogName}
                            setData={setData}
                            addingNewDog={addingNewDog}
                            formRef={formRef}
                            handleSubmit={handleSubmit}
                        />
                        {/* <DeleteModal
                            dogId={dogId}
                            toggle={toggleDeleteModal}
                            handleDelete={handleDelete}
                            isOpen={showDeleteModal}
                            loading={loading}
                            submitting={submitting}
                        /> */}
                    </>
                )}
            </PageBody>
        
        </div>
    );
}

export default connect(
    (state) => ({
        dogName: state.dogs?.dogDetails,
    }),
    {
        fetchDogDetails: actions.fetchDogDetails,
        init: actions.initializeDogAddition,
        saveNewDog: actions.saveNewDog,
        updateDog: actions.updateDog,
        deleteDog: actions.deleteDog,
    }
)(DogSetup);
