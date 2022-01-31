
import { put, call, takeEvery } from "redux-saga/effects";
import debug from 'debug';
import * as actions from './actions';
import * as classTypesClient from '../../../util/apiClients/classTypes';

const log = debug('saga:classes');

function* fetchClassList({ payload }) {
  log('Fetching class list');
  try {
    const res = yield call(classTypesClient.getAllClassTypes);
    yield put(actions.fetchedClassList(res?.data));
    payload.setLoading(false);
  } catch (err) {
    payload.setLoading(false);
    payload.setAlerts([{ color: 'danger', message: 'We\'re having issues retrieving the list of class types.' }]);
  }
}

export default [
  takeEvery(actions.fetchClassList, fetchClassList),
];