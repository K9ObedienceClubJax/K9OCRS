import { handleAction } from "redux-actions";
import * as actions from './actions';

const INITIAL_STATE ={
    dogManagement: {
        dogList: [],
        dogDetails: {},
    },
    myDog: {
        details: {},
    },
};

export default handleAction(
    {
        [actions.fetchedDogList]: (state, {payload}) => ({
            ...state,
            dogList: payload,
        }),
        [actions.fetchedDogDetails]: (state, {payload}) => ({
            ...state,
            dogDetails: payload,
        })
    },
    INITIAL_STATE()
);