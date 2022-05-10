import React from "react";
import { Link } from "react-router-dom";
import { Badge } from 'reactstrap';
import { alignmentWrapper } from "src/util/columns";

const statusColors = {
    Pending: 'dark',
    Active: 'info',
    Completed: 'primary',
    Cancelled: 'warning'
};

const statusTemplate = ({ value }) => <Badge color={statusColors[value]}>{value}</Badge>;

const applicationIdTemplate = ({ value }) => {
    if (!value) return '';
    return <Link to={`/Manage/Applications/Details/${value}`}>{value}</Link>;
};

const classSectionTemplate = ({ value }) => {
    if (!value) return '';
    return (
        <div style={{ textAlign: 'center' }}>
            {`${value}`}
        </div>
    );
};

const classTypeTemplate = ({ value }) => {
    if (!value?.title) return '';
    return <Link to={`/Manage/Classes/Types/${value.id}`}>{value.title}</Link>;
};

const ClassDetailColumns = [
    {
        Header: 'Class Type',
        accessor: (row) => ({ id: row.classTypeID, title: row.classTypeTitle }),
        //Cell: alignmentWrapper('center', classTypeTemplate),
    },
    {
        Header: 'Section #',
        accessor: 'classSectionID',
        Cell: alignmentWrapper('center', classSectionTemplate),
    },
    {
        Header: "Instructor",
        //accessor: (row) => ({ id: row.dogID, name: row.dogName, profilePictureUrl: row.dogProfilePictureUrl }),
        //Cell: alignmentWrapper('left', dogTemplate),
    },
    {
        Header: 'Start Date',
        accessor: 'startDate',
        //Cell: alignmentWrapper('center'),
    },
    {
        Header: 'End Date',
        accessor: 'endDate',
        //Cell: alignmentWrapper('center'),
    },
    {
        Header: 'Time*',
        accessor: 'time',
        //Cell: alignmentWrapper('center', checkMarkTemplate),
    },
    {
        Header: 'Status',
        accessor: 'status',
        //Cell: alignmentWrapper('center', checkMarkTemplate),
    },
];

export default ClassDetailColumns;