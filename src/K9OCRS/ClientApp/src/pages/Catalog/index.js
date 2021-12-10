import React, { Component } from "react";
import Courses from "./components/Courses";

export default class Catalog extends Component {
  static displayName = Catalog.name;

  render() {
    return (
      <div>
        <div>
          <p>
            Welcome to the K9 Club of Jacksonville's Class Registration page
          </p>
          <Courses />
        </div>
      </div>
    );
  }
}
