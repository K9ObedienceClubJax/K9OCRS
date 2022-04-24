import { put, call, takeEvery } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as dogApi from '../../../util/apiClients/dogs';

const log = debug('saga:dogs');

function* initializeDogAddition({ payload }) {
    var res = yield call(dogApi.getPlaceholderImageUrl);
    yield put(actions.initializedDogDetails(res?.data));
    payload.setLoading(false);
}

function* fetchMyDogsList( {payload} ) {
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

function* fetchDogList({payload}) {
    try {
        log('Fetching dogs list');
        yield put(actions.fetchingDogList());

        const result = yield call(dogApi.getAllDogs);

        log('Fetched a list of all dogs', result?.data);
        yield put(actions.fetchedDogList(result?.data));
    } catch (err) {
        log('An error ocurred while fetching a list of dogs', err);
    }
}

function* fetchDogDetails({ payload: dogId }) {
    try {
        log('Fetching dogs details');
        yield put(actions.fetchingDogDetails);

        const result = yield call(dogApi.getById, dogId);

        log('Fetched a dogs details', result);
        yield put(actions.fetchedDogDetails(result));
    } catch (err) {
        log('An error ocurred while fetching a dog\'s details', err);
    }
}

const sagas = [
    takeEvery(actions.fetchMyDogsList, fetchMyDogsList),
    takeEvery(actions.fetchDogList, fetchDogList),
    takeEvery(actions.fetchDogDetails, fetchDogDetails),
    takeEvery(actions.initializeDogAddition, initializeDogAddition),
];
  
  export default sagas;
