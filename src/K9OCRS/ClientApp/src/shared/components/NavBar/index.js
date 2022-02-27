import React, { useState } from "react";
import { connect } from "react-redux";
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
import { isLoggedIn, isAtLeastInstructor, isAdmin } from '../../../util/accessEvaluator';
import selectors from "../../modules/selectors";
import { logout as logoutAction } from '../../../areas/accounts/modules/actions';

import './style.scss';

const NavMenu = props => {
  const { currentUser, logout } = props;
  const [collapsed, setCollapsed] = useState(true);

  return (
      <Navbar
        className="k9-navbar navbar-toggleable-xl flex-xl-row-reverse"
        color="primary"
        expand="xl"
        light
      >
        <NavbarBrand className="m-0"/>
        <NavbarToggler onClick={() => setCollapsed(!collapsed)} />
        <Collapse
          className="d-xl-flex justify-content-end"
          isOpen={!collapsed}
          navbar
        >
          <Nav className="flex-column flex-xl-row">
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/">
                Browse Classes
              </NavLink>
            </NavItem>
            { isLoggedIn(currentUser) && (
              <>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/Account/Classes">
                    My Classes
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/Account/MyDogs">
                    My Dogs
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/Account/Membership">
                    My Membership
                  </NavLink>
                </NavItem>
                {/* This my account link is temporary */}
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/Account">
                    My Account
                  </NavLink>
                </NavItem>
              </>
            )}
            { isAtLeastInstructor(currentUser) && (
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Account/Sections">
                  My Sections
                </NavLink>
              </NavItem>
            )}
            { isAdmin(currentUser) && (
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/Manage">
                  Management
                </NavLink>
              </NavItem>
            )}
          </Nav>
          <div className="ms-5 my-3 my-xl-0">
            { !isLoggedIn(currentUser) && (
              <>
                <Link to="/Account/Login" className="pe-2">
                  <Button color="light" outline>Login</Button>
                </Link>
                <Link to="/Account/Create">
                  <Button color="secondary">Get Started!</Button>
                </Link>
              </>
            )}
            { isLoggedIn(currentUser) && (
              <Button onClick={() => logout()} color="secondary" outline>Logout</Button>
            )}
          </div>
        </Collapse>
      </Navbar>
  );
}

export default connect(state => ({
  currentUser: selectors.selectCurrentUser(state),
}), {
  logout: logoutAction,
})(NavMenu);
