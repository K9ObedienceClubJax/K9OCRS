import { put, call, select, takeEvery } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as apiClient from 'src/util/apiClients/paymentMethods';

const log = debug('saga:billing');

function* fetchPaymentMethods({ payload: { setAlerts } }) {
    try {
        log('Fetching a list of payment methods');
        const includeArchived = yield select((state) => state?.billing?.includeArchived);
        const res = yield call(apiClient.getPaymentMethods, includeArchived);
        yield put(actions.fetchedPaymentMethods(res?.data));
        log('Fetched a list of payment methods', res?.data);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the list of payment methods.",
            },
        ]);
    }
}

function* fetchPaymentMethodDetails({ payload: { id, setAlerts } }) {
    try {
        log(`Fetching payment methods details for id: ${id}`);
        const res = yield call(apiClient.getPaymentMethodById, id);
        yield put(actions.fetchedPaymentMethodDetails(res?.data));
        log(`Fetched payment method details for id: ${id}`, res?.data);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the list of payment methods.",
            },
        ]);
    }
}

const sagas = [
    takeEvery(actions.fetchPaymentMethods, fetchPaymentMethods),
    takeEvery(actions.fetchPaymentMethodDetails, fetchPaymentMethodDetails),
];

export default sagas;
