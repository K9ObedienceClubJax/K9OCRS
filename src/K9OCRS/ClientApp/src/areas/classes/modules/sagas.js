import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import debug from 'debug';
import * as actions from './actions';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import * as classSectionsClient from '../../../util/apiClients/classSections';
import {
    classTypeAddRequestToFormData,
    classTypeUpdateRequestToFormData,
} from '../../../util/formData';

const log = debug('saga:classes');

function* fetchClassList({ payload }) {
    log('Fetching class list');
    try {
        payload.setLoading(true);
        const res = yield call(
            classTypesClient.getAllClassTypes,
            payload.includeArchived,
            true,
            payload.includeDrafts
        );
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
        const res = yield call(classTypesClient.getClassTypeByID, payload.classTypeId);
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
    const { id, setLoading, setSubmitting, setAlerts } = payload;

    log('Saving Class Type changes');
    try {
        var formData = classTypeUpdateRequestToFormData(payload);
        var res = yield call(classTypesClient.updateClassType, formData);
        log('Class Type changes saved!', res?.data);
        setLoading(true);
        yield call(fetchClassDetails, { payload: { classTypeId: id, setLoading, setAlerts } });
        setLoading(false);
        setSubmitting(false);
        setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
    } catch (err) {
        log('An error ocurred while saving changes to an existing class type.', err);
        setSubmitting(false);
        setAlerts([
            {
                color: 'danger',
                message: 'Failed to save changes.',
            },
        ]);
    }
}

function* archiveClassType({ payload }) {
    const { classTypeId, setLoading, setSubmitting, setAlerts } = payload;

    log(`Archiving Class Type id: ${classTypeId}`);
    try {
        var res = yield call(classTypesClient.archiveClassType, classTypeId);
        log(`Class Type archived!`, res?.data);
        setLoading(true);
        yield call(fetchClassDetails, { payload: { classTypeId, setLoading, setAlerts } });
        setLoading(false);
        setSubmitting(false);
        setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
    } catch (err) {
        log(`An error ocurred while archiving the class type id: ${classTypeId}.`, err);
        setSubmitting(false);
        setAlerts([
            {
                color: 'danger',
                message: 'Failed to save changes.',
            },
        ]);
    }
}

function* unarchiveClassType({ payload }) {
    const { classTypeId, setLoading, setSubmitting, setAlerts } = payload;

    log(`Unarchiving Class Type id: ${classTypeId}`);
    try {
        var res = yield call(classTypesClient.unarchiveClassType, classTypeId);
        log(`Class Type unarchived!`, res?.data);
        setLoading(true);
        yield call(fetchClassDetails, { payload: { classTypeId, setLoading, setAlerts } });
        setLoading(false);
        setSubmitting(false);
        setAlerts([
            {
                color: 'success',
                message: 'Your changes are saved!',
            },
        ]);
    } catch (err) {
        log(`An error ocurred while unarchiving the class type id: ${classTypeId}.`, err);
        setSubmitting(false);
        setAlerts([
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
        payload.setSubmitting(true);
        yield call(classTypesClient.deleteClassType, payload.id, payload.targetId);
        log(`Class Type deleted with id: ${payload.id}`);
        payload.setSubmitting(false);
        payload.redirect();
    } catch (err) {
        log(`An error ocurred while deleting the class type with id ${payload.id}`, err);
        payload.setAlerts([
            {
                color: 'danger',
                message: 'Failed to delete the class type.',
            },
        ]);
    }
}

function* fetchSectionDetails({ payload: { sectionId, setAlerts } }) {
    log(`Fetching section details for id: ${sectionId}`);
    try {
        yield put(actions.fetchingSectionDetails());
        const res = yield call(classSectionsClient.getSectionByID, sectionId);
        yield put(actions.fetchedSectionDetails(res?.data));
        log(`Fetched section details for id: ${sectionId}`, res?.data);
    } catch (err) {
        setAlerts([
            {
                color: 'danger',
                message: "We're having trouble retrieving the class section's details.",
            },
        ]);
    }
}

const sagas = [
    takeEvery(actions.fetchClassList, fetchClassList),
    // Class Types
    takeEvery(actions.fetchClassDetails, fetchClassDetails),
    takeEvery(actions.initializeTypeAddition, initializeTypeAddition),
    takeLatest(actions.saveNewClassType, saveNewClassType),
    takeLatest(actions.updateClassType, updateClassType),
    takeLatest(actions.archiveClassType, archiveClassType),
    takeLatest(actions.unarchiveClassType, unarchiveClassType),
    takeLatest(actions.deleteClassType, deleteClassType),
    // Class Sections
    takeEvery(actions.fetchSectionDetails, fetchSectionDetails),
];

export default sagas;
