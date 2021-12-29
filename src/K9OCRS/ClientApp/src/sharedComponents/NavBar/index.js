import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Nav } from "reactstrap";

import './style.scss';

export default class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
        <Navbar
          className="k9-navbar navbar-toggleable-xl flex-xl-row-reverse"
          color="primary"
          expand="xl"
          light
        >
          <NavbarBrand className="m-0"/>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse
            className="d-xl-flex justify-content-end"
            isOpen={!this.state.collapsed}
            navbar
          >
            <Nav className="flex-column flex-xl-row">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">
                  Browse Classes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Account/Classes">
                  My Classes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Account/Sections">
                  My Sections
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Account/Dogs">
                  My Dogs
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Account/Membership">
                  My Membership
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Manage">
                  Management
                </NavLink>
              </NavItem>
              {/* This my account link is temporary */}
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Account">
                  My Account
                </NavLink>
              </NavItem>
            </Nav>
            <div className="ms-5 my-3 my-xl-0">
              <Link to="/Account/Login" className="pe-2">
                <Button color="light" outline>Login</Button>
              </Link>
              <Link to="/Account/Create">
                <Button color="secondary">Get Started!</Button>
              </Link>
            </div>
          </Collapse>
        </Navbar>
    );
  }
}
