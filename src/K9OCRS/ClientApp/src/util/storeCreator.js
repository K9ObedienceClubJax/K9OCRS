import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga';

export const storeCreator = props => {
  const {
    initialState = {},
    reducers,
    sagas,
    // history,
    middlewares = [],
  } = props;

  const sagaMiddleware = createSagaMiddleware();
  const middleware = [
    ...middlewares,
    sagaMiddleware,
  ];

  // Use browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment && typeof window !== 'undefined' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const aggregatedReducers = {
    ...reducers,
  };

  const rootReducer = combineReducers(aggregatedReducers);

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );

  sagaMiddleware.run(sagas);

  return store;
};
