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
import { isAdmin } from 'src/util/accessEvaluator';

const cn = 'dogSetup';

const DogSetup = (props) => {
    const {
        isManagement,
        userIsAdmin,
        loading,
        loadingOptions,
        submitting,
        dogDetails,
        ownerOptions,
        fetchDogDetails,
        init,
        loadOptions,
        saveNewDog,
        updateDog,
        deleteDog,
        archiveDog,
        unarchiveDog,
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
        if (userIsAdmin) {
            loadOptions({ setAlerts });
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

    const breadCrumbItems = [];

    if (isManagement) {
        breadCrumbItems.push(
            { label: 'Management', path: '/Manage' },
            { label: 'Dogs', path: '/Manage/Dogs' }
        );
    } else {
        breadCrumbItems.push({ label: 'My Dogs', path: '/Account/MyDogs' });
    }

    breadCrumbItems.push({
        label: !addingNewDog ? `Dog Setup: ${dogDetails?.name ?? 'Loading...'}` : 'Dog Setup',
        active: true,
    });

    const cancelUrl = isManagement ? '/Manage/Dogs' : '/Account/MyDogs';

    return (
        <div className={cn}>
            <PageHeader
                title={
                    !addingNewDog ? `Dog Setup: ${dogDetails?.name ?? 'Loading...'}` : 'Dog Setup'
                }
                breadCrumbItems={breadCrumbItems}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                {addingNewDog && (
                    <Button tag={Link} to={cancelUrl} color="secondary" outline>
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
                {!addingNewDog &&
                    (!dogDetails?.isArchived ? (
                        <Button
                            color="secondary"
                            disabled={loading || submitting}
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Archived dogs won' be available for class registration until you unarchive them."
                                    )
                                ) {
                                    archiveDog({ dogId, setAlerts });
                                }
                            }}
                        >
                            Archive
                        </Button>
                    ) : (
                        <Button
                            color="secondary"
                            disabled={loading || submitting}
                            onClick={() => unarchiveDog({ dogId, setAlerts })}
                        >
                            Unarchive
                        </Button>
                    ))}
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
                            loadingOptions={loadingOptions}
                            submitting={submitting}
                            dogDetails={dogDetails}
                            setData={setData}
                            addingNewDog={addingNewDog}
                            formRef={formRef}
                            userIsAdmin={userIsAdmin}
                            ownerOptions={ownerOptions}
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
        loadingOptions: state.dogs?.loadingOptions,
        ownerOptions: state.dogs?.ownerOptions,
        submitting: state.dogs?.submitting,
        dogDetails: state.dogs?.dogDetails,
        userIsAdmin: isAdmin(state.shared?.currentUser),
    }),
    {
        fetchDogDetails: actions.fetchDogDetails,
        init: actions.initializeDogAddition,
        loadOptions: actions.loadOptions,
        saveNewDog: actions.saveNewDog,
        updateDog: actions.updateDog,
        deleteDog: actions.deleteDog,
        archiveDog: actions.archiveDog,
        unarchiveDog: actions.unarchiveDog,
    }
)(DogSetup);
