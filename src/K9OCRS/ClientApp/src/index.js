import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import debugModule from 'debug';
import { storeCreator } from 'Util/storeCreator';
import sagas from './sagas';
import * as reducers from './reducers';
import App from './App';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const store = storeCreator({
    initialState: {},
    reducers,
    sagas,
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename={baseUrl}>
            <App />
        </BrowserRouter>
    </Provider>,
    rootElement
);

window.debug = debugModule;
