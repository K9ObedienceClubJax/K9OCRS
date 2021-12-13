import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Layout from './sharedComponents/Layout';

// Page imports
import Catalog from './pages/Catalog';
import Confirm from './pages/Catalog/Confirm';

import Login from './pages/Account/Login';
import CreatePassword from './pages/Account/Create';
import PasswordReset from './pages/Account/PasswordReset';

import MyDogs from './pages/MyDogs';
import DogDetails from './pages/DogDetails';
import DogSetup from './pages/DogSetup';

import ManagementDashboard from './pages/ManagementDashboard';
import ClassTypesDashboard from './pages/ClassTypesDashboard';
import TestUpload from './pages/ClassTypesDashboard/TestUpload';
import ClassTypeSetup from './pages/ClassTypeSetup';

import './app.scss';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Switch>
          {/* Routes available to anyone */}
          <Route path='/' component={Catalog} exact />
          <Route path='/Account/Login' component={Login} />
          <Route path='/Account/Create' component={CreatePassword} />
          <Route path='/Account/PasswordReset' component={PasswordReset} />
          <Route path='/Classes/Apply/Confirm' component={Confirm} />
          {/* Routes available to Logged in Users */}
          <Route path='/Account/Dogs' component={MyDogs} exact />
          <Route path='/Account/Dogs/Add' component={DogSetup} exact />
          <Route path='/Account/Dogs/:dogId' component={DogDetails} exact />
          {/* Routes available to Instructors */}

          {/* Routes available only to Administrators */}
          <Route path='/Manage' component={ManagementDashboard} exact />
          <Route path='/Manage/ClassTypes' component={ClassTypesDashboard} exact />
          <Route path='/Manage/ClassTypes/testImageUpload' component={TestUpload} exact /> {/* This route is just for a quick test, it will be removed */}
          <Route path='/Manage/ClassTypes/:classTypeId' component={ClassTypeSetup} exact />
          {/* This is our 404 route or the route shown when a route is not found */}
          <Route path="*">
            <div>
              <h2>Nothing here!</h2>
            </div>
          </Route>
        </Switch>
      </Layout>
    );
  }
}
