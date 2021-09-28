import { createAction } from 'redux-actions';

const base = 'shared/';
const makeAction = action => createAction(`${base}${action}`);

// Shared actions (used by sagas and reducers)
export const exampleAction = makeAction('EXAMPLE_ACTION');

export const logout = makeAction('LOGOUT');

// Saga-only actions
export const initialize = makeAction('INITIALIZE');
