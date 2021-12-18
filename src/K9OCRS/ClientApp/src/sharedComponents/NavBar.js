import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Nav } from "reactstrap";

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
          className="navbar-toggleable-xl flex-xl-row-reverse"
          color="primary"
          expand="xl"
          light
        >
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
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
          </Collapse>
          <div className="ms-5">
              <Link to="/Account/Login" className="pe-2">
                <Button color="light" outline>Login</Button>
              </Link>
              <Link to="/Account/Create">
                <Button color="secondary">Get Started!</Button>
              </Link>
          </div>
        </Navbar>
    );
  }
}
