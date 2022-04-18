import { handleActions } from "redux-actions";
import * as actions from './actions';

const INITIAL_STATE = {
    dogManagement: {
        loading: false,
        dogList: [],
        dogDetails: {},
    },
    myDogs: {
        loading: false,
        dogList: [],
        details: {},
    },
};

export default handleActions(
    {
        [actions.fetchingMyDogsList]: (state) => ({
            ...state,
            myDogs: {
                ...state.myDogs,
                loading: true,
                dogList: [],
            },
        }),
        [actions.fetchedMyDogsList]: (state, { payload }) => ({
            ...state,
            myDogs:{
                ...state.myDogs,
                loading: false,
                dogList: payload,
            }
        }),
        [actions.fetchingDogList]: (state) => ({
            ...state,
            dogManagement: {
                ...state.dogManagement,
                loading: true,
                dogList: [],
            },
        }),
        [actions.fetchedDogList]: (state, { payload }) => ({
            ...state,
            dogManagement:{
                ...state.dogManagement,
                loading: false,
                dogList: payload,
            }
        }),
        [actions.fetchingDogDetails]: (state) => ({
            ...state,
            dogManagement: {
                ...state.dogManagement,
                loading: true,
                dogDetails: {},
            },
        }),
        [actions.fetchedDogDetails]: (state, { payload }) => ({
            ...state,
            dogManagement:{
                ...state.dogManagement,
                loading: false,
                dogDetails: payload,
            }
        }),
    },
    INITIAL_STATE
);