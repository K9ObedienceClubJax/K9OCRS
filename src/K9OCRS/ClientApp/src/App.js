import React, { Component } from 'react';
import { Routes, Route } from 'react-router';
import ProtectedRoute from './shared/components/Routing/ProtectedRoute';
import GuestOnlyRoute from './shared/components/Routing/GuestOnlyRoute';
import { USER_ROLES } from './util/accessEvaluator';
import Layout from './shared/components/Layout';

// Page imports
import NotFoundPage from './areas/management/404';

import Catalog from './areas/applications/Catalog';
import Classes from './areas/applications/Catalog/Classes';
import Confirm from './areas/applications/Confirmation';

import Login from './areas/accounts/Login';
import CreatePassword from './areas/accounts/Create';
import PasswordReset from './areas/accounts/PasswordReset';
import ChangePassword from './areas/accounts/ChangePassword';
import MyAccount from './areas/accounts/index';

import MyDogs from './pages/MyDogs';
import DogDetails from './pages/DogDetails';
import DogSetup from './pages/DogSetup';

import ManagementDashboard from './areas/management/ManagementDashboard';
import Users from './areas/management/Users/index';
import Create from './areas/management/Users/Create';
import User from './areas/management/Users/User';
import ClassManagement from './areas/classes/ClassManagement';
import ClassTypeSetup from './areas/classes/ClassTypeSetup';
import ClassSectionSetup from './areas/classes/ClassSectionSetup';
import AppManagement from './areas/applications/AppManagement';
import TestUpload from './areas/classes/TestUpload';
import AppDetails from './areas/applications/AppManagement/components/AppDetails';

import './app.scss';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Routes>
                    {/* Routes available to anyone */}
                    <Route path="/" element={<Catalog />} />
                    <Route
                        path="/Account/Login"
                        element={
                            <GuestOnlyRoute>
                                <Login />
                            </GuestOnlyRoute>
                        }
                    />
                    <Route
                        path="/Account/Create"
                        element={
                            <GuestOnlyRoute>
                                <CreatePassword />
                            </GuestOnlyRoute>
                        }
                    />
                    <Route path="/Account/PasswordReset" element={<PasswordReset />} />
                    <Route path="/Account/ChangePassword" element={<ChangePassword />} />
                    <Route path="/Classes/:classTypeId" element={<Classes />} />
                    {/* Routes available to Logged in Users */}
                    <Route
                        path="/Classes/Apply/:sectionId"
                        element={
                            <ProtectedRoute>
                                <Confirm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Account"
                        element={
                            <ProtectedRoute>
                                <MyAccount />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Account/MyDogs"
                        element={
                            <ProtectedRoute>
                                <MyDogs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Account/MyDogs/Add"
                        element={
                            <ProtectedRoute>
                                <DogSetup />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Account/MyDogs/:dogId"
                        element={
                            <ProtectedRoute>
                                <DogDetails />
                            </ProtectedRoute>
                        }
                    />
                    {/* Routes available to Instructors */}
                    {/* Routes available only to Administrators */}
                    <Route
                        path="/Manage"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <ManagementDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Users"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Users/Create"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <Create />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Users/:userId"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <User />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Classes"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <ClassManagement />
                            </ProtectedRoute>
                        }
                    />
                    <ProtectedRoute
                        path="/Manage/Applications"
                        component={AppManagement}
                        minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    <ProtectedRoute 
                        path="/Manage/Applications/Details/:id"
                        component={AppDetails}
                        //minimumAccess={USER_ROLES.Administrator}
                        exact
                    />
                    {/* This route is just for a quick test, it will be removed */}
                    <Route
                        path="/Manage/Classes/testImageUpload"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <TestUpload />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Classes/Types/Add"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <ClassTypeSetup />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Classes/Types/:classTypeId"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <ClassTypeSetup />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Classes/Sections/Add"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <ClassSectionSetup />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Manage/Classes/Sections/:classSectionId"
                        element={
                            <ProtectedRoute minimumAccess={USER_ROLES.Administrator}>
                                <ClassSectionSetup />
                            </ProtectedRoute>
                        }
                    />
                    {/* This is our 404 route or the route shown when a route is not found */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        );
    }
}
