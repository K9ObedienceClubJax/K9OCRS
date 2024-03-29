import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as dogApi from '../../../util/apiClients/dogs';
import * as usersApi from 'src/util/apiClients/userAccounts';
import { dogAddRequestToFormData, dogUpdateRequestToFormData } from 'src/util/formData';

const log = debug('saga:dogs');

function* initializeDogAddition({ payload }) {
    try {
        var res = yield call(dogApi.getPlaceholderImageUrl);
        yield put(
            actions.fetchedDogDetails({
                name: '',
                breed: '',
                dateOfBirth: '',
                profilePictureUrl: res?.data,
                owners: [],
            })
        );
    } catch (error) {
        log('An error ocurred while initializing a dog addition.', error);
    }
}

function* fetchMyDogsList({ payload }) {
    try {
        log('Fetching my dogs list');
        yield put(actions.fetchingMyDogsList());

        const result = yield call(dogApi.getOwnedDogs);

        log('Fetched a list of my dogs', result?.data);
        yield put(actions.fetchedMyDogsList(result?.data));
    } catch (err) {
        log('An error ocurred while fetching my dogs', err);
    }
}

function* fetchDogList({ payload: { setAlerts } }) {
    try {
        log('Fetching dogs list');
        yield put(actions.fetchingDogList());

        const result = yield call(dogApi.getAllDogs);

        log('Fetched a list of all dogs', result?.data);
        yield put(actions.fetchedDogList(result?.data));
    } catch (err) {
        log('An error ocurred while fetching a list of dogs', err);
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the list of dogs.",
            },
        ]);
    }
}

function* fetchDogDetails({ payload: { dogId, setAlerts } }) {
    try {
        log('Fetching dogs details');
        yield put(actions.fetchingDogDetails());

        const result = yield call(dogApi.getById, dogId);

        log('Fetched a dogs details', result?.data);
        yield put(actions.fetchedDogDetails(result?.data));
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the dog's details.",
            },
        ]);
        log("An error ocurred while fetching a dog's details", err);
    }
}

function* loadOptions({ payload: { setAlerts } }) {
    try {
        log('Loading options');

        const result = yield call(usersApi.getDogOwnerOptions);

        log('loaded options', result?.data);
        yield put(actions.loadedOptions(result?.data));
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the dog's details.",
            },
        ]);
        log('An error ocurred while fetching dog owner options', err);
    }
}

function* createDog({ payload: { data, setAlerts, redirect } }) {
    try {
        put(actions.savingChanges());
        const formData = dogAddRequestToFormData(data);
        const created = yield call(dogApi.createDog, formData);
        put(actions.savedChanges());
        redirect(created?.data?.id);
        setAlerts([
            {
                color: 'success',
                message: 'Your changes were saved successfully!',
            },
        ]);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: 'An error ocurred while saving your changes.',
            },
        ]);
    }
}

function* updateDog({ payload: { data, setAlerts } }) {
    try {
        put(actions.savingChanges());
        const formData = dogUpdateRequestToFormData(data);
        yield call(dogApi.updateDog, formData);
        put(actions.savedChanges());
        yield call(fetchDogDetails, { payload: { dogId: data?.id, setAlerts } });
        setAlerts([
            {
                color: 'success',
                message: 'Your changes were saved successfully!',
            },
        ]);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: 'An error ocurred while saving your changes.',
            },
        ]);
    }
}

function* deleteDog({ payload: { id, setAlerts, redirect } }) {
    try {
        put(actions.savingChanges());
        yield call(dogApi.deleteById, id);
        put(actions.savedChanges());
        redirect();
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: 'An error ocurred while saving your changes.',
            },
        ]);
    }
}

function* archiveDog({ payload }) {
    const { dogId, setAlerts } = payload;

    log(`Archiving dog id: ${dogId}`);
    try {
        var res = yield call(dogApi.archiveDog, dogId);
        log(`Dog archived!`, res?.data);
        yield call(fetchDogDetails, { payload: { dogId, setAlerts } });
        setAlerts([
            {
                color: 'success',
                message: 'Dog archived successfully!',
            },
        ]);
    } catch (err) {
        log(`An error ocurred while archiving dog id: ${dogId}.`, err);
        setAlerts([
            {
                color: 'danger',
                message: 'Failed to archive the dog.',
            },
        ]);
    }
}

function* unarchiveDog({ payload }) {
    const { dogId, setAlerts } = payload;

    log(`Unarchiving dog id: ${dogId}`);
    try {
        var res = yield call(dogApi.unarchiveDog, dogId);
        log(`Dog unarchived!`, res?.data);
        yield call(fetchDogDetails, { payload: { dogId, setAlerts } });
        setAlerts([
            {
                color: 'success',
                message: 'Dog unarchived successfully!',
            },
        ]);
    } catch (err) {
        log(`An error ocurred while unarchiving dog id: ${dogId}.`, err);
        setAlerts([
            {
                color: 'danger',
                message: 'Failed to unarchive the dog.',
            },
        ]);
    }
}

function* reviewRecord({ payload: { data, setAlerts } }) {
    try {
        yield call(dogApi.reviewRecord, data);
        yield call(fetchDogDetails, { payload: { dogId: data?.dogId, setAlerts } });
    } catch (err) {
        console.err(err);
    }
}

const sagas = [
    takeEvery(actions.fetchMyDogsList, fetchMyDogsList),
    takeEvery(actions.fetchDogList, fetchDogList),
    takeEvery(actions.fetchDogDetails, fetchDogDetails),
    takeEvery(actions.initializeDogAddition, initializeDogAddition),
    takeLatest(actions.loadOptions, loadOptions),
    takeEvery(actions.saveNewDog, createDog),
    takeEvery(actions.updateDog, updateDog),
    takeLatest(actions.archiveDog, archiveDog),
    takeLatest(actions.unarchiveDog, unarchiveDog),
    takeLatest(actions.deleteDog, deleteDog),
    takeEvery(actions.reviewRecord, reviewRecord),
];

export default sagas;
