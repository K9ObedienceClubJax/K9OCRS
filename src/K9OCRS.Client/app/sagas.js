import { all } from 'redux-saga/effects';
import sharedSagas from './modules/saga';
import PageSagas from 'pages/sagas';

export default function* rootSaga() {
  yield all([
    ...sharedSagas,
    ...PageSagas,
  ]);
}
