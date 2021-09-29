import { combineReducers } from 'redux';

import ExampleReducer from './Example/modules/reducer';

export default combineReducers({
  example: ExampleReducer,
});
