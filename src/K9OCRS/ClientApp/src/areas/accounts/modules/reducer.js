import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
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
    [actions.fetchUserList]: (state, { payload }) => ({
      ...state,
      userManagement: {
        ...state.userManagement,
        userList: payload,
      },
    }),
    [actions.login]: (state, { payload }) => ({
      ...state,
      userManagement: {
        ...state.userManagement,
        userList: payload,
      },
    }),
  },
  INITIAL_STATE
);
