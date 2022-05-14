import { handleActions } from 'redux-actions';
import * as actions from './actions';

const INITIAL_STATE = {
    loading: false,
    submitting: false,
    dogList: [],
    myDogsList: [],
    dogDetails: {},
};

export default handleActions(
    {
        [actions.savingChanges]: (state) => ({
            ...state,
            submitting: true,
        }),
        [actions.savedChanges]: (state) => ({
            ...state,
            submitting: false,
        }),
        [actions.fetchingMyDogsList]: (state) => ({
            ...state,
            loading: true,
        }),
        [actions.fetchedMyDogsList]: (state, { payload }) => ({
            ...state,
            loading: false,
            myDogsList: payload,
        }),
        [actions.fetchingDogList]: (state) => ({
            ...state,
            loading: true,
            dogList: [],
        }),
        [actions.fetchedDogList]: (state, { payload }) => ({
            ...state,
            loading: false,
            dogList: payload,
        }),
        [actions.fetchingDogDetails]: (state) => ({
            ...state,
            loading: true,
            dogDetails: {},
        }),
        [actions.fetchedDogDetails]: (state, { payload }) => ({
            ...state,
            loading: false,
            dogDetails: payload,
        }),
    },
    INITIAL_STATE
);
