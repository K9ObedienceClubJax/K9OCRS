import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import ProtectedRoute from './shared/components/Routing/ProtectedRoute';
import GuestOnlyRoute from './shared/components/Routing/GuestOnlyRoute';
import { USER_ROLES } from './util/accessEvaluator';
import Layout from './shared/components/Layout';

// Page imports
import Catalog from './areas/applications/Catalog';
import Confirm from './areas/applications/Confirmation';

import Login from './pages/Account/Login';
import CreatePassword from './pages/Account/Create';
import PasswordReset from './pages/Account/PasswordReset';

import MyDogs from './pages/MyDogs';
import DogDetails from './pages/DogDetails';
import DogSetup from './pages/DogSetup';

import ManagementDashboard from './areas/management/ManagementDashboard';
import ClassTypesList from './areas/classes/ClassTypes/List';
import ClassTypeSetup from './areas/classes/ClassTypes/Setup';
import TestUpload from './areas/classes/ClassTypes/TestUpload';

import './app.scss';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Switch>
          {/* Routes available to anyone */}
          <Route path='/' component={Catalog} exact />
          <GuestOnlyRoute path='/Account/Login' component={Login} />
          <GuestOnlyRoute path='/Account/Create' component={CreatePassword} />
          <Route path='/Account/PasswordReset' component={PasswordReset} />
          <Route path='/Classes/Apply/Confirm' component={Confirm} />
          {/* Routes available to Logged in Users */}
          <ProtectedRoute
            path='/Account/MyDogs'
            component={MyDogs}
            exact
          />
          <ProtectedRoute
            path='/Account/MyDogs/Add'
            component={DogSetup}
            exact
          />
          <ProtectedRoute
            path='/Account/MyDogs/:dogId'
            component={DogDetails}
            exact
          />
          {/* Routes available to Instructors */}
          {/* Routes available only to Administrators */}
          <ProtectedRoute
            path='/Manage'
            component={ManagementDashboard}
            minimumAccess={USER_ROLES.Administrator}
            exact
          />
          <ProtectedRoute
            path='/Manage/ClassTypes'
            component={ClassTypesList}
            minimumAccess={USER_ROLES.Administrator}
            exact
          />
          {/* This route is just for a quick test, it will be removed */}
          <ProtectedRoute
            path='/Manage/ClassTypes/testImageUpload'
            component={TestUpload}
            minimumAccess={USER_ROLES.Administrator}
            exact
          />
          <ProtectedRoute
            path='/Manage/ClassTypes/:classTypeId'
            component={ClassTypeSetup}
            minimumAccess={USER_ROLES.Administrator}
            exact
          />
          {/* This is our 404 route or the route shown when a route is not found */}
          <Route path='*'>
            <div>
              <h2>Nothing here!</h2>
            </div>
          </Route>
        </Switch>
      </Layout>
    );
  }
}
