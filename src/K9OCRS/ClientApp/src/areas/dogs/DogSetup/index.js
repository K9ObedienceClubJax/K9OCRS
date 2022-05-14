import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';
import PageBody from '../../../shared/components/PageBody';
import DogEditor from './DogEditor';
import ClassTable from './ClassTable';

import './styles.scss';

const cn = 'dogSetup';

const DogSetup = (props) => {
    const {
        loading,
        submitting,
        dogDetails,
        fetchDogDetails,
        init,
        saveNewDog,
        updateDog,
        deleteDog,
    } = props;

    const navigate = useNavigate();
    const { dogId } = useParams();
    const addingNewDog = !dogId;

    const [alerts, setAlerts] = useState([]);
    const [data, setData] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (addingNewDog) {
            init();
        } else {
            fetchDogDetails({ dogId, setAlerts });
        }
    }, [dogId]); // eslint-disable-line

    const handleSubmit = () => {
        if (addingNewDog) {
            saveNewDog({
                data,
                setAlerts,
                redirect: (dogId) => navigate(`/Account/MyDogs/${dogId}`),
            });
        } else {
            updateDog({
                data,
                setAlerts,
            });
        }
    };

    const requestFormSubmit = () => {
        if (formRef.current.reportValidity()) {
            handleSubmit();
        }
    };

    const handleDelete = () => {
        if (
            window.confirm(
                'This action cannot be reverted. All information related to this dog will be erased.'
            )
        ) {
            deleteDog({
                id: dogId,
                setAlerts,
                redirect: () => navigate('/Account/MyDogs'),
            });
        }
    };

    return (
        <div className={cn}>
            <PageHeader
                title={
                    !addingNewDog ? `Dog Setup: ${dogDetails?.name ?? 'Loading...'}` : 'Dog Setup'
                }
                breadCrumbItems={[
                    { label: 'My Dogs', path: '/Account/MyDogs' },
                    {
                        label: !addingNewDog
                            ? `Dog Setup: ${dogDetails?.name ?? 'Loading...'}`
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
                            onClick={handleDelete}
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
                            loading={loading}
                            submitting={submitting}
                            dogDetails={dogDetails}
                            setData={setData}
                            addingNewDog={addingNewDog}
                            formRef={formRef}
                        />
                        {!addingNewDog && <ClassTable />}
                    </>
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        loading: state.dogs?.loading,
        submitting: state.dogs?.submitting,
        dogDetails: state.dogs?.dogDetails,
    }),
    {
        fetchDogDetails: actions.fetchDogDetails,
        init: actions.initializeDogAddition,
        saveNewDog: actions.saveNewDog,
        updateDog: actions.updateDog,
        deleteDog: actions.deleteDog,
    }
)(DogSetup);
