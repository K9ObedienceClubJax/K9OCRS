import { handleActions } from 'redux-actions';
import * as actions from './actions';

const savedPreferencesKey = 'paymentMethodsManagementPreferences';

const emptyDetails = {
    id: null,
    name: '',
    description: '',
    instructions: '',
    isArchived: false,
};

const INITIAL_STATE = () => {
    const preferences = JSON.parse(localStorage.getItem(savedPreferencesKey));
    return {
        // settings
        includeArchived: preferences?.includeArchived ?? false,
        // Pages
        loading: true,
        paymentMethodsList: [],
        paymentMethodDetails: emptyDetails,
    };
};

const savePreferences = (state) =>
    localStorage.setItem(
        savedPreferencesKey,
        JSON.stringify({
            includeArchived: state?.includeArchived,
        })
    );

export default handleActions(
    {
        [actions.toggledIncludeArchived]: (state) => {
            const updatedState = {
                ...state,
                includeArchived: !state.includeArchived,
            };
            savePreferences(updatedState);
            return updatedState;
        },
        [actions.fetchPaymentMethods]: (state) => ({
            ...state,
            loading: true,
            paymentMethodsList: [],
        }),
        [actions.fetchedPaymentMethods]: (state, { payload }) => ({
            ...state,
            loading: false,
            paymentMethodsList: payload || [],
        }),
        [actions.fetchPaymentMethodDetails]: (state) => ({
            ...state,
            loading: true,
            paymentMethodDetails: emptyDetails,
        }),
        [actions.fetchedPaymentMethodDetails]: (state, { payload }) => ({
            ...state,
            loading: false,
            paymentMethodDetails: payload || emptyDetails,
        }),
    },
    INITIAL_STATE()
);
