import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import ProtectedRoute from './shared/components/Routing/ProtectedRoute';
import GuestOnlyRoute from './shared/components/Routing/GuestOnlyRoute';
import { USER_ROLES } from './util/accessEvaluator';
import Layout from './shared/components/Layout';

// Page imports
import notFoundPage from './areas/management/404';

import Catalog from './areas/applications/Catalog';
import Classes from './areas/applications/Catalog/Classes';
import Confirm from './areas/applications/Confirmation';

import Login from './areas/accounts/Login';
import CreatePassword from './areas/accounts/Create';
import PasswordReset from './areas/accounts/PasswordReset';
import ChangePassword from './areas/accounts/ChangePassword';
import MyAccount from './areas/accounts/index';

import MyDogs from './areas/dogs/MyDogs';
import DogDetails from './areas/dogs/DogDetails';
import DogSetup from './areas/dogs/DogSetup';

import ManagementDashboard from './areas/management/ManagementDashboard';
import Users from './areas/management/Users/index';
import Create from './areas/management/Users/Create';
import User from './areas/management/Users/User';
import ClassManagement from './areas/classes/ClassManagement';
import ClassTypeSetup from './areas/classes/ClassTypeSetup';
import TestUpload from './areas/classes/TestUpload';

import './app.scss';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Switch>
                    {/* Routes available to anyone */}
                    <Route path="/" component={Catalog} exact />
                    <GuestOnlyRoute path="/Account/Login" component={Login} />
                    <GuestOnlyRoute path="/Account/Create" component={CreatePassword} />
                    <Route path="/Account/PasswordReset" component={PasswordReset} />
                    <Route path="/Account/ChangePassword" component={ChangePassword} />
                    <Route path="/Classes/:classTypeId" component={Classes} exact />
                    {/* Routes available to Logged in Users */}
                    <ProtectedRoute path="/Classes/Apply/:sectionId" component={Confirm} />
                    <ProtectedRoute path="/Account" component={MyAccount} exact />
                    <ProtectedRoute path="/Account/MyDogs" component={MyDogs} exact />
                    <ProtectedRoute path="/Account/MyDogs/Add" component={DogSetup} exact />
                    <ProtectedRoute path="/Account/MyDogs/:dogId" component={DogDetails} exact />
                    {/* Routes available to Instructors */}
                    {/* Routes available only to Administrators */}
                    <ProtectedRoute
                        path="/Manage"
                        component={ManagementDashboard}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute
                        path="/Manage/Users"
                        component={Users}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute
                        path="/Manage/Users/Create"
                        component={Create}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute
                        path="/Manage/Users/:userId"
                        component={User}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute
                        path="/Manage/Classes"
                        component={ClassManagement}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    {/* This route is just for a quick test, it will be removed */}
                    <ProtectedRoute
                        path="/Manage/Classes/testImageUpload"
                        component={TestUpload}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute
                        path="/Manage/Classes/Types/Add"
                        component={ClassTypeSetup}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute
                        path="/Manage/Classes/Types/:classTypeId"
                        component={ClassTypeSetup}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    {/* This is our 404 route or the route shown when a route is not found */}
                    <Route path="*" component={notFoundPage} />
                </Switch>
            </Layout>
        );
    }
}
