import { handleActions } from 'redux-actions';
import * as actions from './actions';

const savedPreferencesKey = 'classManagementPreferences';

const INITIAL_STATE = () => {
    const preferences = JSON.parse(localStorage.getItem(savedPreferencesKey));
    return {
        includeArchived: preferences?.includeArchived ?? false,
        includeDrafts: preferences?.includeDrafts ?? false,
        classList: [],
        classDetails: null,
        section: {
            loading: true,
            submitting: false,
            details: null,
        },
    };
};

const savePreferences = (state) =>
    localStorage.setItem(
        savedPreferencesKey,
        JSON.stringify({
            includeArchived: state?.includeArchived,
            includeDrafts: state?.includeDrafts,
        })
    );

export default handleActions(
    {
        // Classes
        [actions.fetchedClassList]: (state, { payload }) => ({
            ...state,
            classList: payload,
        }),
        [actions.toggledIncludeArchived]: (state) => {
            const updatedState = {
                ...state,
                includeArchived: !state.includeArchived,
            };
            savePreferences(updatedState);
            return updatedState;
        },
        [actions.toggledIncludeDrafts]: (state) => {
            const updatedState = {
                ...state,
                includeDrafts: !state.includeDrafts,
            };
            savePreferences(updatedState);
            return updatedState;
        },
        // Class Types
        [actions.fetchedClassDetails]: (state, { payload }) => ({
            ...state,
            classDetails: payload,
        }),
        [actions.initializedClassDetails]: (state, { payload }) => ({
            ...state,
            classDetails: { imageUrl: payload },
        }),
        // Class Sections
        [actions.fetchingSectionDetails]: (state) => ({
            ...state,
            section: {
                ...state.section,
                loading: true,
            },
        }),
        [actions.fetchedSectionDetails]: (state, { payload }) => ({
            ...state,
            section: {
                ...state.section,
                loading: false,
                details: payload ?? null,
            },
        }),
    },
    INITIAL_STATE()
);
