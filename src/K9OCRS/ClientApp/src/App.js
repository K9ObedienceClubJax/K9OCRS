import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { FetchData } from "./components/FetchData";
import { Counter } from "./components/Counter";
import ClassTypesDashboard from "./pages/ClassTypesDashboard";
import ClassTypeSetup from "./pages/ClassTypeSetup";
import Confirm from "./pages/Registration/Confirm";
import Login from "./pages/Login";

import "./custom.scss";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/counter" component={Counter} />
        <Route path="/fetch-data" component={FetchData} />
        <Route path="/classtypes" component={ClassTypesDashboard} />
        <Route path="/classtypes/:classTypeId" component={ClassTypeSetup} />
        <Route path="/confirm" component={Confirm} />
        <Route path="/login" component={Login} />
      </Layout>
    );
  }
}
