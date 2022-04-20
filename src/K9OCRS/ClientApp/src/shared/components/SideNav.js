import React from 'react';
import { useLocation } from 'react-router-dom';
import * as accessEvaluator from '../../util/accessEvaluator';

const SideNav = (props) => {
  const userRole = props.userRoleID;
  const location = useLocation().pathname;

  return (
    <div
      className='nav flex-column nav-pills'
      role='tablist'
      aria-orientation='vertical'
    >
      <a
        className={`nav-link ${location === '/Account' ? 'active' : ''}`}
        data-toggle='pill'
        href='/Account'
        role='tab'
      >
        Profile
      </a>
      <a
        className={`nav-link ${location === '/MyDogs' ? 'active' : ''}`}
        data-toggle='pill'
        href='/Account/MyDogs'
        role='tab'
      >
        My Dogs
      </a>
      <a
        className={`nav-link ${location === '/MyClasses' ? 'active' : ''}`}
        data-toggle='pill'
        href='/Account/MyClasses'
        role='tab'
      >
        My Classes
      </a>
      <a
        className={`nav-link ${location === '/MyMembership' ? 'active' : ''}`}
        data-toggle='pill'
        href='/Account/MyMembership'
        role='tab'
      >
        Membership
      </a>
      {userRole < accessEvaluator.USER_ROLES.Member && (
        <a
          className={`nav-link ${location === '/MySections' ? 'active' : ''}`}
          data-toggle='pill'
          href='/Account/MySections'
          role='tab'
        >
          My Sections
        </a>
      )}
    </div>
  );
};

export default SideNav;
