import React from 'react';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import { USER_ROLES } from '../../../util/accessEvaluator';
import { alignmentWrapper } from '../../../util/columns';
import { BsCheckLg } from 'react-icons/bs';

const USER_ROLES_KEYS = Object.keys(USER_ROLES);

const idTemplate = ({ value }) => {
    return value;
};

const userTemplate = ({ value }) => {
    return (
        <div>
            <ProfileBadge {...value} imageUrl={value.profilePictureUrl} link />
        </div>
    );
};

const roleTemplate = ({ value }) => {
    return USER_ROLES_KEYS.find((key) => USER_ROLES[key] === value);
};

const emailTemplate = ({ value }) => {
    return value;
};

const membershipTemplate = ({ value }) => (value ? <BsCheckLg className="text-success" /> : '--');

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
        Cell: alignmentWrapper('left', userTemplate),
    },
    {
        Header: 'Email',
        accessor: 'email',
        Cell: emailTemplate,
    },
    {
        Header: 'Membership',
        accessor: 'isMember',
        Cell: membershipTemplate,
    },
    {
        Header: 'Role',
        accessor: 'userRoleID',
        Cell: roleTemplate,
    },
];

export default columns;
