
import { all, put, takeEvery } from "redux-saga/effects";
import debug from 'debug';
import * as actions from './actions';

const log = debug('saga:classes');

// This hasn't been implemented yet, I just wanted to scaffold it
function* fetchClassList() {
  log('Fetching class list');
  yield all([
    put(actions.fetchedClassList([])),
  ]);
}

export default [
  takeEvery(actions.fetchClassList, fetchClassList),
];