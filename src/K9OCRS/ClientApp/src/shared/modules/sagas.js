import { put, call, takeEvery } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as accountsApi from '../../util/apiClients/userAccounts';

const log = debug('saga:shared');

function* example() {
    // This is an example saga, we can use sagas to make api calls and store their results on our redux store
    // in this case, I'm just setting a simple value on the redux store.
    log('Running example saga');
    yield put(actions.setExampleSagaResult('Hello from the example saga!'));
}

function* refreshLogin() {
    // Use try/catch blocks whenever making API calls for error handling
    try {
        log('Logging in');
        // Below, call the api and get the data, transform the data however it needs to be transformed, if it needs to be and then update the redux store
        //Hit endpoint
        const response = yield call(accountsApi.loginStatus);

        // Then put an action so the reducer is updated with the new data
        if (!response?.data) {
            yield put(actions.loggedout());
        } else {
            log(`Logged in as ${response?.data.name}`);
            console.log(`Logged in as ${response?.data.firstName} ${response?.data.lastName}`);
            yield put(actions.loginRefreshed(response?.data));
        }
    } catch (err) {
        log('An error ocurred on login', err);
        yield put(actions.loginRefreshed(null));
    }
}

const sagas = [
    takeEvery(actions.exampleSaga, example),
    takeEvery(actions.refreshLogin, refreshLogin),
];

export default sagas;
