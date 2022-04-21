import { createAction } from 'redux-actions';

const base = 'classes/';
const makeAction = (action) => createAction(`${base}${action}`);

//#region Classes
// Shared actions (used by sagas and reducers)
export const toggledIncludeArchived = makeAction('TOGGLED_INCLUDE_ARCHIVED');
export const toggledIncludeDrafts = makeAction('TOGGLED_INCLUDE_DRAFTS');

// Saga-only actions
export const fetchClassList = makeAction('FETCH_CLASS_LIST');
//#endregion

//#region Class Type
// Shared actions (used by sagas and reducers)
export const fetchedClassList = makeAction('FETCHED_CLASS_LIST');
export const fetchedClassDetails = makeAction('FETCHED_CLASS_DETAILS');
export const initializedClassDetails = makeAction('INITIALIZED_CLASS_DETAILS');

// Saga-only actions
export const fetchClassDetails = makeAction('FETCH_CLASS_DETAILS');
export const initializeTypeAddition = makeAction('INIT_TYPE_ADD');
export const saveNewClassType = makeAction('SAVE_NEW_CLASS_TYPE');
export const updateClassType = makeAction('UPDATE_CLASS_TYPE');
export const deleteClassType = makeAction('DELETE_CLASS_TYPE');
export const archiveClassType = makeAction('ARCHIVE_CLASS_TYPE');
export const unarchiveClassType = makeAction('UNARCHIVE_CLASS_TYPE');
//#endregion

//#region Class Section
// Shared actions (used by sagas and reducers)
export const fetchingSectionDetails = makeAction('FETCHING_SECTION_DETAILS');
export const fetchedSectionDetails = makeAction('FETCHED_SECTION_DETAILS');

// Saga-only actions
export const fetchSectionDetails = makeAction('FETCH_SECTION_DETAILS');
//#endregion
