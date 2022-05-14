import React from "react";
import { alignmentWrapper } from "src/util/columns";

const classSectionTemplate = ({ value }) => {
    if (!value) return '';
    return (
        <div style={{ textAlign: 'center' }}>
            {`${value}`}
        </div>
    );
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