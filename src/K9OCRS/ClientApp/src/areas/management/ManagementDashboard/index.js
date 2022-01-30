import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

export default function ManagementDashboard() {
  return (
    <div>
      <h2>Class Management</h2>
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/Manage/ClassTypes">
            Class Types
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  )
}

