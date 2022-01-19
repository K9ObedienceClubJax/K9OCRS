
import { all, put, takeEvery } from "redux-saga/effects";
import debug from 'debug';
import * as actions from './actions';

const log = debug('saga:shared');

function* example() {
  // This is an example saga, we can use sagas to make api calls and store their results on our redux store
  log('Initializing');
  yield all([
    put(actions.setExampleSagaResult('Hello from the initialize saga!')),
  ]);
}

export default [
  takeEvery(actions.exampleSaga, example),
];