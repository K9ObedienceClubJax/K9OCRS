import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

export default function ManagementDashboard() {
  return (
    <div>
      <h2>Class Management</h2>
      <Nav>
        <NavItem>
          <NavLink href="/Manage/ClassTypes">
            Class Types
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  )
}

