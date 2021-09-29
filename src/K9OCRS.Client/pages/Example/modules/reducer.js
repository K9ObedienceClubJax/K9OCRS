import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  testMessage: null,
};

export default handleActions({
  [actions.exampleAction]: (state, { payload }) => ({
    ...state,
    testMessage: `Result from querying for all volunteer IDs:\n${JSON.stringify(payload, null, 2)}`,
  }),
}, INITIAL_STATE);
