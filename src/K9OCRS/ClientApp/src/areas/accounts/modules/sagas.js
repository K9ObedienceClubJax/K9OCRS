
import { put, takeEvery } from "redux-saga/effects";
import debug from 'debug';
import * as actions from './actions';
// we also need shared actions because current user information is on the shared reducer
import * as sharedActions from '../../../shared/modules/actions';

const log = debug('saga:accounts');

function* login() {
  // Use try/catch blocks whenever making API calls for error handling
  try {
    log('Logging in');
    // Below, call the api and get the data, transform the data however it needs to be transformed, if it needs to be and then update the redux store

    // Then put an action so the reducer is updated with the new data
    yield put(sharedActions.loggedin(/* here goes the result comming from your login endpoint */));
  } catch (err) {
    log('An error ocurred on login', err);
  }
}

function* logout() {
  try {
    log('Logging out');
    // Call the api endpoint that removes the http-only cookie for the logged in user

    // Then put an action so the current user's data is removed from the redux store and our front-end knows they're logged out
    yield put(sharedActions.loggedout());
  } catch (err) {
    log('An error ocurred on logout', err);
  }
}

// This hasn't been fully implemented yet, it's just an example
function* fetchUserList() {
  try {
    log('Fetching user list');
    // Below, call the api and get the data, transform the data however it needs to be transformed, if it needs to be and then update the redux store

    // Then put an action so the reducer is updated with the new data
    yield put(actions.fetchedUserList([
      {
        userId: 1,
        email: 'example@example.com',
        firstName: 'example',
        lastName: 'example',
        role: 'Student',
      },
    ])); // change this to the data coming from the server
  } catch (err) {
    log('An error ocurred while fetching user list', err);
  }
}

export default [
  takeEvery(actions.login, login),
  takeEvery(actions.logout, logout),
  takeEvery(actions.fetchUserList, fetchUserList),
];