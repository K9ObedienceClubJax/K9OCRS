import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import debugModule from 'debug';
import { storeCreator } from './util/storeCreator';
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

const paypalOption = {
    'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
};

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename={baseUrl}>
            <PayPalScriptProvider options={paypalOption}>
                <App />
            </PayPalScriptProvider>
        </BrowserRouter>
    </Provider>,
    rootElement
);

window.debug = debugModule;
