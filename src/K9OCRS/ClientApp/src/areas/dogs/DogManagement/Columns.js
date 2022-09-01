import React from 'react';
import { Badge } from 'reactstrap';
import ProfileBadge from 'src/shared/components/ProfileBadge';
import { alignmentWrapper } from 'src/util/columns';
import { formatDogAge } from 'src/util/dates';

const dogTemplate = ({ value }) => {
    if (!value) return '--';
    return (
        <ProfileBadge
            id={value?.id}
            imageUrl={value?.profilePictureUrl}
            firstName={value?.name}
            lastName={value?.lastName}
            isDog
            link
        />
    );
};

const ageTemplate = ({ value }) => {
    if (!value) return '--';
    return formatDogAge(value);
};

const archivedTemplate = ({ value }) => {
    if (!value) return <Badge color="info">Active</Badge>;
    return <Badge color="dark">Archived</Badge>;
};

const Columns = [
    {
        Header: 'Dog',
        accessor: (row) => ({
            id: row.id,
            name: row.name,
            lastName: row.lastName,
            profilePictureUrl: row.profilePictureUrl,
        }),
        Cell: alignmentWrapper('left', dogTemplate),
    },
    {
        Header: 'Breed',
        accessor: 'breed',
    },
    {
        Header: 'Age',
        accessor: 'dateOfBirth',
        Cell: alignmentWrapper('left', ageTemplate),
    },
    // {
    //     Header: 'Completed Classes',
    //     accessor: 'completedClasses',
    //     //Cell: alignmentWrapper('center'),
    // },
    // {
    //     Header: 'Active Classes',
    //     accessor: 'activeClasses',
    //     //Cell: alignmentWrapper('center'),
    // },
    // {
    //     Header: 'Pending Applications',
    //     accessor: 'pendingApplications',
    //     //Cell: alignmentWrapper('center', checkMarkTemplate),
    // },
    // {
    //     Header: 'Vaccination Status',
    //     accessor: 'vaccinationStatus',
    //     //Cell: alignmentWrapper('center', checkMarkTemplate),
    // },
    {
        Header: 'Status',
        accessor: 'isArchived',
        Cell: alignmentWrapper('left', archivedTemplate),
    },
];

export default Columns;
