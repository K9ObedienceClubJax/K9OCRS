import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

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
  const startTime = moment(value.startTime).format('ha');
  const endTime = moment(value.endTime).format('ha');
  return `${startTime} - ${endTime}`;
};

const classTypeTemplate = ({ value }) => {
  if (!value?.title) return '';
  return <Link to={`/Manage/Classes/Types/${value.id}`}>{value.title}</Link>
};

const columns = [
  {
    Header: 'Class Type',
    accessor: (row) => ({ id: row.id, title: row.title }),
    Cell: classTypeTemplate,
  },
  {
    Header: 'Section',
    accessor: 'sectionId',
    Cell: ({ value }) => <Link to={`/Manage/Classes/Sections/${value}`}>{value}</Link>
  },
  {
    Header: 'Instructor',
  },
  {
    Header: 'Capacity',
    accessor: 'rosterCapacity',
  },
  {
    Header: 'Enrolled',
    accessor: 'rosterActual',
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
    accessor: (row) => ({ startTime: row.startTime, endTime: row.endTime }),
    Cell: timeTemplate,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }) => <Badge color={statusColors[value]}>{value}</Badge>,
  }
];

export default columns;