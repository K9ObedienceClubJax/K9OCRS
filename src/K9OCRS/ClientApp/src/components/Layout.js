import React, { Component } from "react";
import { Container } from "reactstrap";
import NavBar from "./NavBar";
import SiteBanner from "./SiteBanner";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavBar />
        <SiteBanner />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
