import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  classList: [],
  classDetails: null,
  sectionDetails: null,
};

export default handleActions({
  [actions.fetchedClassList]: (state, { payload }) => ({
    ...state,
    classList: payload,
  }),
  [actions.fetchedClassDetails]: (state, { payload }) => ({
    ...state,
    classDetails: payload,
  }),
  [actions.fetchedSectionDetails]: (state, { payload }) => ({
    ...state,
    sectionDetails: payload,
  }),
}, INITIAL_STATE);