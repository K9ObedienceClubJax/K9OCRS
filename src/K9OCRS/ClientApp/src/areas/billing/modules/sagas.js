import { put, call, select, takeEvery, takeLatest } from 'redux-saga/effects';
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

function* updatePaymentMethod({ payload: { data, setAlerts } }) {
    try {
        log(`Updating payment methods details for id: ${data?.id}`);
        const res = yield call(apiClient.updatePaymentMethod, data);
        yield put(actions.updatedPaymentMethod());
        log(`Updated payment method details for id: ${data?.id}`, res?.data);
        yield put(actions.fetchPaymentMethodDetails({ id: data?.id, setAlerts }));
        setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues saving your changes.",
            },
        ]);
    }
}

function* createPaymentMethod({ payload: { data, setAlerts, navigate } }) {
    try {
        log(`Creating a payment method named: ${data?.name}`);
        const res = yield call(apiClient.createPaymentMethod, data);
        yield put(actions.createdPaymentMethod());
        log('Created a payment method', res?.data);
        navigate(`/Manage/PaymentMethods/${res?.data?.id}`);
        setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having issues saving your changes.",
            },
        ]);
    }
}

const sagas = [
    takeEvery(actions.fetchPaymentMethods, fetchPaymentMethods),
    takeEvery(actions.fetchPaymentMethodDetails, fetchPaymentMethodDetails),
    takeLatest(actions.updatePaymentMethod, updatePaymentMethod),
    takeLatest(actions.createPaymentMethod, createPaymentMethod),
];

export default sagas;
