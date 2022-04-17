import { handleAction } from "redux-actions";
import * as actions from './actions';

const INITIAL_STATE ={
    dogManagement: {
        loading: false,
        dogList: [],
        dogDetails: {},
    },
    myDog: {
        loading: false,
        details: {},
    },
};

export default handleAction(
    {
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
    INITIAL_STATE()
);