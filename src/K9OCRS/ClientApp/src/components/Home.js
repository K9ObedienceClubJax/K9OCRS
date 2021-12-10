import React, { Component } from "react";
import Courses from "../pages/sections/Courses";

export class Home extends Component {
  static displayName = Home.name;

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
