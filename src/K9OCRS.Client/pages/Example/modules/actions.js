import { createAction } from 'redux-actions';

const base = 'example/';
const makeAction = action => createAction(`${base}${action}`);

// Shared actions (used by sagas and reducers)
export const exampleAction = makeAction('EXAMPLE_ACTION');

// Saga-only actions
export const initialize = makeAction('INITIALIZE');
