import { createAction } from "redux-actions";

const base = 'dogs/';
const makeAction = (action) => createAction(`${base}${action}`);

// shared actions used by sagas and reducers
export const fetchingMyDogsList = makeAction('FETCHING_MY_DOGS_LIST');
export const fetchedMyDogsList = makeAction('FETCHED_MY_DOGS_LIST');

export const fetchingDogList = makeAction('FETCHING_DOG_LIST');
export const fetchedDogList = makeAction('FETCHED_DOG_LIST');

export const fetchingDogDetails = makeAction('FETCHING_DOG_DETAILS');
export const fetchedDogDetails = makeAction('FETCHED_DOG_DETAILS');

// saga only actions
export const fetchMyDogsList = makeAction('FETCH_MY_DOGS_LIST');
export const fetchDogList = makeAction('FETCH_DOG_LIST');
export const fetchDogDetails = makeAction('FETCH_DOG_DETAILS');
export const initializeDogAddition = makeAction('INIT_TYPE_ADD');
export const initializedDogDetails = makeAction('INITIALIZED_DOG_DETAILS');
export const saveNewDog = makeAction('SAVE_NEW_DOG');
export const updateDog = makeAction('UPDATE_DOG');
export const deleteDog = makeAction('DELETE_DOG');