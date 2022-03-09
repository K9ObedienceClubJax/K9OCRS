import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

export default function ManagementDashboard() {
  return (
    <div>
      <h2>Management Areas</h2>
      <p>The look of this page will change soon</p>
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/Manage/Classes">
            Class Management
          </NavLink>
          <NavLink tag={Link} to="/Manage/Users">
            Users Management
          </NavLink>
          <NavLink tag={Link} to="/Manage/Dogs">
            Dogs Management
          </NavLink>
          <NavLink tag={Link} to="/Manage/Applications">
            Applications Management
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  )
}

