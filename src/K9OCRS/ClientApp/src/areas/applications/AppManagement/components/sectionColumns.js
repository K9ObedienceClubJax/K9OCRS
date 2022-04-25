import React from 'react';
import { Badge } from 'reactstrap';
import { alignmentWrapper } from '../../../../util/columns';
import ProfileBadge from '../../../../shared/components/ProfileBadge';
import { BsCheckLg, BsXLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const statusColors = {
    Pending: 'dark',
    Active: 'info',
    Completed: 'primary',
    Cancelled: 'warning'
};

const statusTemplate = ({ value }) => <Badge color={statusColors[value]}>{value}</Badge>;

const checkMarkTemplate = ({ value }) => value ? <BsCheckLg className="text-success" /> : <BsXLg className='text-danger' />;

/* const dogTemplate = ({ value }) => {
    return (
      <div>
        <ProfileBadge
          {...value}
          imageUrl={value.profilePictureUrl}
          link
        />
      </div>
    );
  }; */


const applicationIdTemplate = ({ value }) => {
    if (!value) return '';
    return <Link to={`/Manage/Applications/Details/${value}`}>{value}</Link>;
};

const classSectionTemplate = ({ value }) => {
    if (!value) return '';
    return (
        <div style={{ textAlign: 'center' }}>
            <Link to={`/Manage/Classes/Sections/${value}`}>{value}</Link>
        </div>
    );
};

const classTypeTemplate = ({ value }) => {
    if (!value?.title) return '';
    return <Link to={`/Manage/Classes/Types/${value.id}`}>{value.title}</Link>;
};

const columns = [
    {
        Header: 'Application ID',
        accessor: 'id',
        Cell: alignmentWrapper('center', applicationIdTemplate),
    },
    {
        Header: 'Class Type',
        // accessor: 'classTypeTitle',
        accessor: (row) => ({ id: row.classTypeID, title: row.classTypeTitle }),
        Cell: alignmentWrapper('center', classTypeTemplate),
    },
    {
        Header: 'Class Section',
        accessor: 'classSectionID',
        Cell: alignmentWrapper('center', classSectionTemplate),
    },
    {
        Header: "Dog's Name",
        accessor: 'dogName',
        Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Main Attendee',
        accessor: 'mainAttendee',
        Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
        Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Is Paid',
        accessor: 'isPaid',
        Cell: alignmentWrapper('center', checkMarkTemplate),
    },
    {
        Header: 'Is Refunded',
        accessor: 'isRefunded',
        Cell: alignmentWrapper('center', checkMarkTemplate),
    },
    {
        Header: 'Application Status',
        accessor: 'status',
        Cell: alignmentWrapper('center', statusTemplate),
    },
];

export default columns;
