import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
    NavLink,
    Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Nav } from 'reactstrap';
import {
    isLoggedIn,
    isAtLeastInstructor,
    isAdmin,
} from '../../../util/accessEvaluator';
import selectors from '../../modules/selectors';
import { logout as logoutAction } from '../../../areas/accounts/modules/actions';

import './style.scss';

const NavMenu = (props) => {
    const { currentUser, logout } = props;
    const [collapsed, setCollapsed] = useState(true);

    return (
        <Navbar
            className="k9-navbar navbar-toggleable-lg flex-lg-row-reverse"
            tabIndex={0}
            color="primary"
            expand="lg"
            light
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    // Not triggered when swapping focus between children
                    setCollapsed(true);
                }
            }}
        >
            <NavbarBrand className="m-0" />
            <NavbarToggler onClick={() => setCollapsed(!collapsed)} />
            <Collapse
                className="d-lg-flex justify-content-end"
                isOpen={!collapsed}
                navbar
            >
                <Nav className="flex-column flex-lg-row">
                    <NavItem>
                        <NavLink
                            tag={Link}
                            className="text-dark"
                            to="/"
                            onClick={() => setCollapsed(true)}
                        >
                            Class Catalog
                        </NavLink>
                    </NavItem>
                    {isLoggedIn(currentUser) && (
                        <>
                            <NavItem>
                                <NavLink
                                    tag={Link}
                                    className="text-dark"
                                    to="/Account/Classes"
                                    onClick={() => setCollapsed(true)}
                                >
                                    My Classes
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    tag={Link}
                                    className="text-dark"
                                    to="/Account/MyDogs"
                                    onClick={() => setCollapsed(true)}
                                >
                                    My Dogs
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    tag={Link}
                                    className="text-dark"
                                    to="/Account/Membership"
                                    onClick={() => setCollapsed(true)}
                                >
                                    My Membership
                                </NavLink>
                            </NavItem>
                            {/* This my account link is temporary */}
                            <NavItem>
                                <NavLink
                                    tag={Link}
                                    className="text-dark"
                                    to="/Account"
                                    onClick={() => setCollapsed(true)}
                                >
                                    My Account
                                </NavLink>
                            </NavItem>
                        </>
                    )}
                    {isAtLeastInstructor(currentUser) && (
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/Account/Sections"
                                onClick={() => setCollapsed(true)}
                            >
                                My Sections
                            </NavLink>
                        </NavItem>
                    )}
                    {isAdmin(currentUser) && (
                        <NavItem>
                            <NavLink
                                tag={Link}
                                className="text-dark"
                                to="/Manage"
                                onClick={() => setCollapsed(true)}
                            >
                                Management
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                <div className="ms-5 my-3 my-xl-0">
                    {!isLoggedIn(currentUser) && (
                        <>
                            <Link
                                to="/Account/Login"
                                className="pe-2"
                                onClick={() => setCollapsed(true)}
                            >
                                <Button color="light" outline>
                                    Login
                                </Button>
                            </Link>
                            <Link
                                to="/Account/Create"
                                onClick={() => setCollapsed(true)}
                            >
                                <Button color="secondary">
                                    Create an Account
                                </Button>
                            </Link>
                        </>
                    )}
                    {isLoggedIn(currentUser) && (
                        <Button
                            onClick={() => {
                                logout();
                                setCollapsed(true);
                            }}
                            color="secondary"
                            outline
                        >
                            Logout
                        </Button>
                    )}
                </div>
            </Collapse>
        </Navbar>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {
        logout: logoutAction,
    }
)(NavMenu);
