import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  refreshingUser: true,
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
      refreshingUser: false,
      currentUser: null,
    }),
    [actions.loginRefreshed]: (state, { payload }) => ({
      ...state,
      refreshingUser: false,
      currentUser: payload,
    }),
  },
  INITIAL_STATE
);
