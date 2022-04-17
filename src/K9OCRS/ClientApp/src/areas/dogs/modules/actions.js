import { createAction } from "redux-actions";

const base = 'dogs/';
const makeAction = (action) => createAction(`${base}${action}`);

// shared actions used by sagas and reducers
export const fetchedDogList = makeAction('FETCHED_DOG_LIST');
export const fetchedDogDetails = makeAction('FETCHED_DOG_DETAILS');

// saga only actions
export const fetchDogList = makeAction('FETCH_DOG_LIST')
export const fetchDogDetails = makeAction('FETCH_DOG_DETAILS')
export const saveNewDog = makeAction('SAVE_NEW_DOG');
export const updateDog = makeAction('UPDATE_DOG');
export const deleteDog = makeAction('DELETE_DOG');a