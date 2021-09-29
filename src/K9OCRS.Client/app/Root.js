import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { SITEMAP } from './sitemap';
import Layout from './Layout';

import './style.scss';

export const Root = ({ store, history }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Switch>
              {
                Object.values(SITEMAP).map((page, index) => {
                  return (
                    <Route key={index} path={page.path} exact={page.exact} component={page.component || (() => <div>Placeholder</div>)} />
                  );
                })
              }
              <Route render={() => <div>Not Found</div>} />
            </Switch>
          </Layout>
        </Suspense>
      </ConnectedRouter>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};