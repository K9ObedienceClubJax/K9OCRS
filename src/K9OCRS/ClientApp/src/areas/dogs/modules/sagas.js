import { put, call, takeEvery } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as dogApi from '../../../util/apiClients/dogs';

const log = debug('saga:dogs');

function* fetchDogList() {
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
    takeEvery(actions.fetchDogList, fetchDogList),
];
  
  export default sagas;
