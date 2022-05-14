import { createAction } from 'redux-actions';

const base = 'accounts/';
const makeAction = (action) => createAction(`${base}${action}`);

// Shared actions (used by sagas and reducers)
export const fetchedUserList = makeAction('FETCHED_USER_LIST');

// Saga-only actions
export const login = makeAction('LOGIN');
export const logout = makeAction('LOGOUT');
export const archiveUser = makeAction('ARCHIVE_USER');
export const unarchiveUser = makeAction('UNARCHIVE_USER');
export const deleteUser = makeAction('DELETE_USER');
