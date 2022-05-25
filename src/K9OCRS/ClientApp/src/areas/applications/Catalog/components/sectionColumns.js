import React from 'react';
import moment from 'moment-timezone';
import { Button, Tooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { alignmentWrapper } from '../../../../util/columns';
import ProfileBadge from '../../../../shared/components/ProfileBadge';
import { timespanToMoment } from '../../../../util/dates';

const dateTemplate = ({ value }) => {
    if (!value) return '';
    return moment(value).format(`MMM Do, YYYY`);
};

const timeTemplate = ({ value }) => {
    if (!value?.startTime) return '';
    const startTime = timespanToMoment(value.startTime).format('ha');
    const endTime = timespanToMoment(value.endTime).format('ha');
    return `${startTime} - ${endTime}`;
};

const classSectionTemplate = ({ value: { id, isFull } }) => {
    if (!id) return '';
    return !isFull ? (
        <Link to={`/Classes/Apply/${id}`}>
            <Button>Enroll</Button>
        </Link>
    ) : (
        <span id={`ACTION${id}`} title="The class section is full">
            <Button style={{ pointerEvents: 'none' }} disabled>
                Enroll
            </Button>
            <Tooltip target={`ACTION${id}`}>The class section is full</Tooltip>
        </span>
    );
};

const instructorTemplate = ({ value }) => {
    if (!value) return '';
    return <ProfileBadge {...value} imageUrl={value.profilePictureUrl} />;
};

const numberTemplate = ({ value }) => (!value ? 0 : value);

const columns = [
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
        accessor: (row) => ({ startTime: row.startTime, endTime: row.endTime }),
        Cell: alignmentWrapper('center', timeTemplate),
    },
    {
        Header: 'Instructor',
        accessor: 'instructor',
        Cell: alignmentWrapper('left', instructorTemplate),
    },
    {
        Header: 'Capacity',
        accessor: 'rosterCapacity',
        Cell: alignmentWrapper('center', numberTemplate),
    },
    {
        Header: 'Enrolled',
        accessor: 'rosterActual',
        Cell: alignmentWrapper('center', numberTemplate),
    },
    {
        Header: '',
        id: 'action',
        accessor: (row) => ({ id: row.id, isFull: row.rosterActual >= row.rosterCapacity }),
        Cell: alignmentWrapper('center', classSectionTemplate),
    },
];

export default columns;
