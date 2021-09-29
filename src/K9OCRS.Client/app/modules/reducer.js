import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  currentUser: null,
  testMessage: null,
};

export default handleActions({
  [actions.logout]: (state) => ({
    ...state,
    currentUser: null,
  }),
  [actions.exampleAction]: (state, { payload }) => ({
    ...state,
    testMessage: `Message from the example action: ${payload}`,
  }),
}, INITIAL_STATE);
