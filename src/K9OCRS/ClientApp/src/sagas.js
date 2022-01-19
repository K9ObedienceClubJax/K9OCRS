import { all } from 'redux-saga/effects';
import sharedSagas from './shared/modules/sagas';
import accountsSagas from './areas/accounts/modules/sagas';
import classSagas from './areas/classes/modules/sagas';

export default function* rootSaga() {
  yield all([
    ...sharedSagas,
    ...accountsSagas,
    ...classSagas,
  ]);
}