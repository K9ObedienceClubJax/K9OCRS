import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { alignmentWrapper } from 'src/util/columns';

const statusColors = {
    true: 'dark',
    false: 'info',
};

const paymentMethodTemplate = ({ value }) => {
    if (!value) return '--';
    const { id, name, isIntegration } = value;
    return !isIntegration ? <Link to={`/Manage/PaymentMethods/${id}`}>{name}</Link> : name;
};

const textTemplate = ({ value }) => (!value ? '--' : value);

const typeTemplate = ({ value }) => (value ? 'Integration' : 'Manual');

const statusTemplate = ({ value }) => (
    <Badge color={statusColors['' + value]}>{value ? 'Archived' : 'Active'}</Badge>
);

const columns = [
    {
        Header: 'Payment Method',
        accessor: (row) => ({ id: row.id, name: row.name, isIntegration: row.isIntegration }),
        Cell: paymentMethodTemplate,
    },
    {
        Header: 'Description',
        accessor: 'description',
        Cell: textTemplate,
    },
    {
        Header: 'Type',
        accessor: 'isIntegration',
        Cell: alignmentWrapper('center', typeTemplate),
    },
    {
        Header: 'Status',
        accessor: 'isArchived',
        Cell: alignmentWrapper('center', statusTemplate),
    },
];

export default columns;
