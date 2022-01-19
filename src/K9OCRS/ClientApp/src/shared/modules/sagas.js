
import { put, takeEvery } from "redux-saga/effects";
import debug from 'debug';
import * as actions from './actions';

const log = debug('saga:shared');

function* example() {
  // This is an example saga, we can use sagas to make api calls and store their results on our redux store
  // in this case, I'm just setting a simple value on the redux store.
  log('Running example saga');
  yield put(actions.setExampleSagaResult('Hello from the example saga!'));
}

export default [
  takeEvery(actions.exampleSaga, example),
];