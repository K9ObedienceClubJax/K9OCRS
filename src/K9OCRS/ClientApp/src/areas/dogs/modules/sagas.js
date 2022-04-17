import { put, call, takeEvery } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as dogApi from '../../../util/apiClients/dogs';

const log = debug('saga:dogs');

function* fetchDogList() {
    try {
        log('Fetching dogs list');
        yield put(actions.fetchingDogList);

        const result = yield call(dogApi.getAllDogs);

        log('Fetched a list of all dogs', result);
        yield put(actions.fetchedDogList(result));
    } catch (err) {
        log('An error ocurred while fetching a list of dogs', err);
    }
}

const sagas = [
    takeEvery(actions.fetchDogList, fetchDogList),
];
  
  export default sagas;
