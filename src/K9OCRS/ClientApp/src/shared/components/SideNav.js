import React from 'react';

const SideNav = (props) => {
  const current = props.current;
  const userRole = props.userRoleID;
  var active = [false, false, false, false, false];
  active[current] = true;
  var hasSections = false;
  if (userRole < 3) {
    hasSections = true;
  }

  return (
    <div
      className='nav flex-column nav-pills'
      role='tablist'
      aria-orientation='vertical'
    >
      <a
        className={`nav-link ${active[0] ? 'active' : ''}`}
        data-toggle='pill'
        href='/Account'
        role='tab'
      >
        Profile
      </a>
      <a
        className={`nav-link ${active[1] ? 'active' : ''}`}
        data-toggle='pill'
        href='/MyDogs'
        role='tab'
      >
        My Dogs
      </a>
      <a
        className={`nav-link ${active[2] ? 'active' : ''}`}
        data-toggle='pill'
        href='/MyClasses'
        role='tab'
      >
        My Classes
      </a>
      <a
        className={`nav-link ${active[3] ? 'active' : ''}`}
        data-toggle='pill'
        href='/Membership'
        role='tab'
      >
        Membership
      </a>
      {hasSections === true && (
        <a
          className={`nav-link ${active[4] ? 'active' : ''}`}
          data-toggle='pill'
          href='/MySections'
          role='tab'
        >
          My Sections
        </a>
      )}
    </div>
  );
};

export default SideNav;
