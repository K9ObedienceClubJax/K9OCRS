import React from 'react';
import moment from 'moment-timezone';
import {  Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { alignmentWrapper } from '../../../../util/columns';
import ProfileBadge from '../../../../shared/components/ProfileBadge';

const dateTemplate = ({ value }) => {
  if (!value) return '';
  return moment(value).format(`MMM Do, YY`);
};

const timeTemplate = ({ value }) => {
  if (!value?.startTime) return '';
  const startTime = moment(value.startTime).format('ha');
  const endTime = moment(value.endTime).format('ha');
  return `${startTime} - ${endTime}`;
};

const classSectionTemplate = ({ value }) => {
  if (!value) return '';
  return (
      <Link to={`/Classes/Apply/${value}`}>
          <Button>Enroll</Button>
      </Link>
  );
};

const instructorTemplate = ({ value }) => {
  if (!value) return '';
  return <ProfileBadge {...value} imageUrl={value.profilePictureUrl} link/>
};

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
    Cell: alignmentWrapper('center'),
  },
  {
    Header: 'Enrolled',
    accessor: 'rosterActual',
    Cell: alignmentWrapper('center'),
  },
  {
    Header: '',
    accessor: 'id',
    Cell: alignmentWrapper('center', classSectionTemplate)
  }
];

export default columns;