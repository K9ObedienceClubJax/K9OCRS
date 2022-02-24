import React from 'react';
import ProfileBadge from '../../../shared/components/ProfileBadge';


const idTemplate = ({ value }) => {
  return value;
};

const userTemplate = ({ value }) => {
  return (
    <div>
      <ProfileBadge
        {...value}
        imageUrl={value.profilePictureUrl}
      />
    </div>
  );
};

const roleTemplate = ({ value }) => {
  switch (value) {
    case 1:
      return 'Admin';
    case 2:
      return 'Instructor';
    case 3:
      return 'Member';
    default:
      return 'Non-Member';
  }
};

const emailTemplate = ({ value }) => {
  return value;
};

// const dogTemplate = ({ value }) => {
//   return value;
// };

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
    Cell: idTemplate,
  },
  {
    Header: 'Name',
    accessor: (row) => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      profilePictureUrl: row.profilePictureUrl,
    }),
    Cell: userTemplate,
  },
  {
    Header: 'Email',
    accessor: 'email',
    Cell: emailTemplate,
  },
  // {
  //   Header: 'Dogs',
  //   accessor: '',
  //   Cell: dogTemplate,
  // },
  {
    Header: 'Role',
    accessor: 'userRoleID',
    Cell: roleTemplate,
  },
];

export default columns;
