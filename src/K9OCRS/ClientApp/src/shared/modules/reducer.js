import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  currentUser: null,
  // State for the whole area
  myAccount: {
    details: {},
  },
  userManagement: {
    // State for the subsection of the area
    userList: [],
    userDetails: {},
  },
};

export default handleActions(
  {
    [actions.setExampleSagaResult]: (state, { payload }) => ({
      ...state,
      exampleSagaResult: payload,
    }),
    [actions.loggedin]: (state, { payload }) => ({
      ...state,
      currentUser: payload,
    }),
    [actions.loggedout]: (state) => ({
      ...state,
      currentUser: null,
    }),
    [actions.loginRefreshed]: (state, { payload }) => ({
      ...state,
      currentUser: payload,
    }),
  },
  INITIAL_STATE
);