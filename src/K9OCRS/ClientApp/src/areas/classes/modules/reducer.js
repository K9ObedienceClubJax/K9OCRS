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
        sectionDetails: null,
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
        [actions.fetchedClassList]: (state, { payload }) => ({
            ...state,
            classList: payload,
        }),
        [actions.fetchedClassDetails]: (state, { payload }) => ({
            ...state,
            classDetails: payload,
        }),
        [actions.initializedClassDetails]: (state, { payload }) => ({
            ...state,
            classDetails: { imageUrl: payload },
        }),
        [actions.fetchedSectionDetails]: (state, { payload }) => ({
            ...state,
            sectionDetails: payload,
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
    },
    INITIAL_STATE()
);
