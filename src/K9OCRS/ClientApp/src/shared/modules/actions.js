import { createAction } from 'redux-actions';

const base = 'shared/';
const makeAction = action => createAction(`${base}${action}`);

// Shared actions (used by sagas and reducers)
export const logout = makeAction('LOGOUT');
export const setExampleSagaResult = makeAction('EXAMPLE_SAGA_RESULT');

// Saga-only actions
export const initialize = makeAction('INITIALIZE');
export const login = makeAction('LOGIN');
export const exampleSaga = makeAction('EXAMPLE_SAGA');