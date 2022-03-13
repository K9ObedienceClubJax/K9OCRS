import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import {
    classTypeAddRequestToFormData,
    classTypeUpdateRequestToFormData,
} from '../../../util/formData';

const log = debug('saga:classes');

function* fetchClassList({ payload }) {
    log('Fetching class list');
    try {
        const res = yield call(classTypesClient.getAllClassTypes);
        yield put(actions.fetchedClassList(res?.data));
        payload.setLoading(false);
    } catch (err) {
        payload.setLoading(false);
        payload.setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the list of classes.",
            },
        ]);
    }
}

function* fetchClassDetails({ payload }) {
    log(`Fetching class details for id: ${payload.classTypeId}`);
    try {
        const res = yield call(
            classTypesClient.getClassTypeByID,
            payload.classTypeId
        );
        yield put(actions.fetchedClassDetails(res?.data));
        payload.setLoading(false);
    } catch (err) {
        payload.setLoading(false);
        payload.setAlerts([
            {
                color: 'danger',
                message: "We're having issues retrieving the class details.",
            },
        ]);
    }
}

function* initializeTypeAddition({ payload }) {
    var res = yield call(classTypesClient.getPlaceholderImageUrl);
    yield put(actions.initializedClassDetails(res?.data));
    payload.setLoading(false);
}

function* saveNewClassType({ payload }) {
    log('Saving new class type');
    try {
        var formData = classTypeAddRequestToFormData(payload);
        var res = yield call(classTypesClient.createClassType, formData);
        log('Class Type saved!', res?.data);
        payload.setSubmitting(false);
        payload.redirect(res?.data);
        payload.setAlerts([
            {
                color: 'success',
                message: 'The class type was saved successfully!',
            },
        ]);
    } catch (err) {
        log('An error ocurred while saving a new class type.', err);
        payload.setSubmitting(false);
        payload.setAlerts([
            {
                color: 'danger',
                message: 'Failed to save changes.',
            },
        ]);
    }
}

function* updateClassType({ payload }) {
    log('Saving Class Type changes');
    try {
        var formData = classTypeUpdateRequestToFormData(payload);
        var res = yield call(classTypesClient.updateClassType, formData);
        log('Class Type changes saved!', res?.data);
        payload.setSubmitting(false);
        log('Reloading Class Type');
        yield call(fetchClassDetails, {
            payload: {
                classTypeId: payload.id,
                setLoading: payload.setLoading,
                setAlerts: payload.setAlerts,
            },
        });
        log('Reloaded Class Type');
        payload.setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
    } catch (err) {
        log(
            'An error ocurred while saving changes to an existing class type.',
            err
        );
        payload.setSubmitting(false);
        payload.setAlerts([
            {
                color: 'danger',
                message: 'Failed to save changes.',
            },
        ]);
    }
}

const sagas = [
    takeEvery(actions.fetchClassList, fetchClassList),
    takeEvery(actions.fetchClassDetails, fetchClassDetails),
    takeEvery(actions.initializeTypeAddition, initializeTypeAddition),
    takeLatest(actions.saveNewClassType, saveNewClassType),
    takeLatest(actions.updateClassType, updateClassType),
];

export default sagas;
