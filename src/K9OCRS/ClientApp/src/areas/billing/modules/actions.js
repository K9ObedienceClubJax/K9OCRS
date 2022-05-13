import { createAction } from 'redux-actions';

const base = 'billing/';
const makeAction = (action) => createAction(`${base}${action}`);

// Shared actions (used by sagas and reducers)
export const toggledIncludeArchived = makeAction('TOGGLED_INCLUDE_ARCHIVED');

export const fetchPaymentMethods = makeAction('FETCH_PAYMENT_METHODS');
export const fetchedPaymentMethods = makeAction('FETCHED_PAYMENT_METHODS');

export const fetchPaymentMethodDetails = makeAction('FETCH_PAYMENT_METHOD_DETAILS');
export const fetchedPaymentMethodDetails = makeAction('FETCHED_PAYMENT_METHOD_DETAILS');

export const updatePaymentMethod = makeAction('UPDATE_PAYMENT_METHOD');
export const updatedPaymentMethod = makeAction('UPDATED_PAYMENT_METHOD');
