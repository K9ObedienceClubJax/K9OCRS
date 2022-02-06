import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useExpanded, useTable } from 'react-table';
import defaultColumns from './columns';

import './style.scss';

const Table = props => {
  const {
    columns,
    data,
    tableConfig,
    expandable = false,
  } = props;

  const plugins = [];
  const initialState = {};

  const activeColumns = useMemo(() => {
    const result = columns;
    // Insert expander as first column
    if (expandable && !result.some(c => c.id === defaultColumns.Expander.id)) result.splice(0, 0, defaultColumns.Expander);

    return result;
  }, [JSON.stringify(columns), expandable]); // eslint-disable-line

  const initExpanded = useMemo(() => expandable && data?.reduce((prev, curr) => {
    prev[curr.id] = true;
    return prev;
  }, {}), [expandable, data]);

  if (expandable) {
    plugins.push(useExpanded);
    initialState.expanded = initExpanded;
  }

  const tableInstance = useTable({
    columns: activeColumns,
    data,
    getRowId: (row, idx, parent) => parent ? [parent.id, row.id].join('.') : row.id,
    ...tableConfig,
    initialState,
  }, ...plugins);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const cn = 'k9-table';

  return (
    <table className={cn} {...getTableProps()}>
      <thead>
        {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
        rows.map(row => {
          // Prepare the row for display
          prepareRow(row)
          return (
            // Apply the row props
            <tr className={`${row.id}`.includes('.') ? '' : 'k9-table__top-row'} {...row.getRowProps()}>
              {// Loop over the rows cells
              row.cells.map(cell => {
                // Apply the cell props
                return (
                  <td {...cell.getCellProps()}>
                    {// Render the cell contents
                    cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
};

Table.defaultProps = {
  tableConfig: {},
  expandable: false,
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  })).isRequired,
  data: PropTypes.array.isRequired,
  tableConfig: PropTypes.object,
  expandable: PropTypes.bool,
};

export default Table;
