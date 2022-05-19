import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { alignmentWrapper } from '../../../util/columns';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import { timespanToMoment } from '../../../util/dates';

const statusColors = {
    Scheduled: 'dark',
    Ongoing: 'info',
    Completed: 'success',
};

const dateTemplate = ({ value }) => {
    if (!value) return '';
    return moment(value).format(`MMM Do, YY`);
};

const timeTemplate = ({ value }) => {
    if (!value?.startTime) return '';
    const startTime = timespanToMoment(value.startTime).format('ha');
    const endTime = timespanToMoment(value.endTime).format('ha');
    return `${startTime} - ${endTime}`;
};

const classTypeTemplate = ({ value }) => {
    if (!value?.title) return '';
    return <Link to={`/Manage/Classes/Types/${value.id}`}>{value.title}</Link>;
};

const classSectionTemplate = ({ value }) => {
    if (!value) return '';
    return (
        <div style={{ textAlign: 'center' }}>
            <Link to={`/Manage/Classes/Sections/${value}`}>{value}</Link>
        </div>
    );
};

const instructorTemplate = ({ value }) => {
    if (!value) return '';
    return <ProfileBadge {...value} imageUrl={value.profilePictureUrl} link />;
};

const statusTemplate = ({ value }) => <Badge color={statusColors[value]}>{value}</Badge>;

const columns = [
    {
        Header: 'Class Type',
        accessor: (row) => (!row.title ? null : { id: row.id, title: row.title }),
        Cell: classTypeTemplate,
    },
    {
        Header: 'Section',
        accessor: 'sectionId',
        Cell: classSectionTemplate,
    },
    {
        Header: 'Instructor',
        accessor: 'instructor',
        Cell: alignmentWrapper('left', instructorTemplate),
    },
    {
        Header: 'Capacity',
        accessor: 'rosterCapacity',
        Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Enrolled',
        accessor: 'rosterActual',
        Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Start Date',
        accessor: 'startDate',
        Cell: dateTemplate,
    },
    {
        Header: 'End Date',
        accessor: 'endDate',
        Cell: dateTemplate,
    },
    {
        Header: 'Time*',
        accessor: (row) => {
            if (!row.startTime || !row.endTime) return null;
            return {
                startTime: row.startTime,
                endTime: row.endTime,
            };
        },
        Cell: alignmentWrapper('center', timeTemplate),
    },
    {
        Header: 'Status',
        accessor: (row) => row.status ?? (row.isArchived ? 'Archived' : null),
        Cell: alignmentWrapper('center', statusTemplate),
    },
];

export default columns;
