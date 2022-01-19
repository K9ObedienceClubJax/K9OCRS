import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  // This should contain the user's email, id, name and role when they're logged in
  currentUser: null,
  exampleSagaResult: '',
  // Some examples of stuff that might be in here later
  // notifications: [],
  // alerts: [],
};

export default handleActions({
  [actions.setExampleSagaResult]: (state, { payload }) => ({
    ...state,
    exampleSagaResult: payload,
  }),
  [actions.loggedin]: (state, { payload }) => ({
    ...state,
    currentUser: payload,
  }),
  [actions.loggedout]: state => ({
    ...state,
    currentUser: null,
  }),
}, INITIAL_STATE);