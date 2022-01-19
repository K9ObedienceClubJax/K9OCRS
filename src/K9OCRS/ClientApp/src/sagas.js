import { all } from 'redux-saga/effects';
import sharedSagas from './shared/modules/sagas';

export default function* rootSaga() {
  yield all([
    ...sharedSagas,
  ]);
}