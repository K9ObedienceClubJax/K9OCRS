import { all, put, takeEvery } from "redux-saga/effects";
import debug from 'debug';
// import proxies from 'util/proxies';
import * as actions from './actions';

const log = debug('saga:shared');

function* initialize() {
  log('Initializing');
  yield all([
    put(actions.exampleAction('Hello from the initialize saga!')),
  ]);
}

export default [
  takeEvery(actions.initialize, initialize),
];