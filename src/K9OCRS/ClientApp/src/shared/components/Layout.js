import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavBar from './NavBar';
import SiteBanner from './SiteBanner';

export default class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavBar />
        <SiteBanner />
        <Container className='px-4 px-md-5' fluid>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
