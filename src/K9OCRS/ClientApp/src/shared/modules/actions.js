import { createAction } from 'redux-actions';

const base = 'shared/';
const makeAction = action => createAction(`${base}${action}`);

// Shared actions (used by sagas and reducers)
export const loggedin = makeAction('LOGGED_IN');
export const loggedout = makeAction('LOGGED_OUT');
export const setExampleSagaResult = makeAction('EXAMPLE_SAGA_RESULT');

// Saga-only actions
export const exampleSaga = makeAction('EXAMPLE_SAGA');