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
        payload.setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
        setTimeout(() => window.location.reload(), 2000);
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

function* deleteClassType({ payload }) {
    log(`Deleting Class Type id: ${payload.id}`);
    try {
        yield call(classTypesClient.deleteClassType, payload.id);
        log(`Class Type deleted with id: ${payload.id}`);
        payload.redirect();
    } catch (err) {
        log(
            `An error ocurred while deleting the class type with id ${payload.id}`,
            err
        );
        payload.setAlerts([
            {
                color: 'danger',
                message: 'Failed to delete the class type.',
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
    takeLatest(actions.deleteClassType, deleteClassType),
];

export default sagas;
