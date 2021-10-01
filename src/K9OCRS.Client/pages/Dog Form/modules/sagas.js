import { all, put, call, spawn, takeLatest } from "redux-saga/effects";
import debug from 'debug';
// import proxies from 'util/proxies';
import * as actions from './actions';

const log = debug('saga:example');

function* getAllVolunteerIDs() {
  try {
    log('Retrieving all volunteer IDs...');
    // const result = yield call(proxies.getAllVolunteerIDs);
    const result = { data: [] }; // hard coding since we don't have endpoints yet
    yield put(actions.exampleAction(result.data));
  } catch(err) {
    log('Error retrieving all volunteer IDs');
  }
}

function* initialize() {
  log('Initializing');
  yield spawn(getAllVolunteerIDs);
}

export default [
  takeLatest(actions.initialize, initialize),
];