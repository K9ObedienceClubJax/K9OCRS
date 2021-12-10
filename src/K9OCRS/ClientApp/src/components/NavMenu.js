import React, { Component } from "react";
import paw from "../images/paw.png";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";

export class NavMenu extends Component {
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
      <header className="bg-dark">
        <Navbar
          className="nav-background navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3 px-4"
          light
        >
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse
            className="d-sm-inline-flex flex-sm-row-reverse"
            isOpen={!this.state.collapsed}
            navbar
          >
            <ul className="navbar-nav flex-grow">
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
            </ul>
          </Collapse>
          <div>
            <Link to="/Login">
              <Button color="primary">Login</Button>
            </Link>
          </div>
        </Navbar>
        <div className="container ml-2 pt-0 pb-2 mb-2 text-white bg-dark">
          <h2>
            K9 Obedience Club <img src={paw} alt="paw" />
          </h2>
        </div>
      </header>
    );
  }
}
