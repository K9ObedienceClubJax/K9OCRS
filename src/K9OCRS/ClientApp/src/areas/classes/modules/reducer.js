import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
  classTypesManagement: {
    classList: [],
    classDetails: {},
  },
  classSectionsManagement: {
    sectionList: [],
    sectionDetails: {},
  },
};

export default handleActions({
  [actions.fetchedClassList]: (state, { payload }) => ({
    ...state,
    classTypesManagement: {
      ...state.classTypesManagement,
      classList: payload,
    },
  }),
  [actions.fetchedClassDetails]: (state, { payload }) => ({
    ...state,
    classTypesManagement: {
      ...state.classTypesManagement,
      classDetails: payload,
    },
  }),
  [actions.fetchedSectionList]: (state, { payload }) => ({
    ...state,
    classSectionsManagement: {
      ...state.classSectionsManagement,
      sectionList: payload,
    },
  }),
  [actions.fetchedSectionDetails]: (state, { payload }) => ({
    ...state,
    classSectionsManagement: {
      ...state.classSectionsManagement,
      sectionDetails: payload,
    },
  }),
}, INITIAL_STATE);