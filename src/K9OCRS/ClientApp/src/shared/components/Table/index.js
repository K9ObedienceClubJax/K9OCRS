import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTable, useExpanded, usePagination  } from 'react-table';
import CustomPagination from '../Pagination';
import defaultColumns from './columns';

import './style.scss';

const Table = props => {
  const {
    columns,
    data,
    tableConfig,
    expandable,
    withPagination,
    pageSize,
    footnotes,
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

  if (withPagination) {
    plugins.push(usePagination);
    initialState.pageSize = pageSize;
  }

  const tableInstance = useTable({
    columns: activeColumns,
    data,
    getRowId: (row, idx, parent) => parent ? [parent.id, row.id].join('.') : row.id,
    ...tableConfig,
    initialState,
  }, ...plugins);

  const {
    state,
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    rows,
    // used when pagination is on
    page,
    gotoPage,
  } = tableInstance;

  const activeRows = withPagination ? page : rows;

  const cn = 'k9-table';

  return (
    <div className={cn}>
      <table className={`${cn}__table`} {...getTableProps()}>
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
          activeRows.map(row => {
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
      <div className={`${cn}__extras-container`}>
        { footnotes?.length > 0 ? (
          <div className={`${cn}__footnotes-container`}>
            {footnotes.map((f, idx) => <p key={idx}>{f}</p>)}
          </div>
        ) : null }
        { withPagination ? (
          <div className={`${cn}__pagination-container`}>
            <CustomPagination
              className={`${cn}__pagination`}
              onPageChange={gotoPage}
              totalCount={rows.length}
              currentPage={state.pageIndex}
              pageSize={state.pageSize}
              useTablePagination
            />
          </div>
        ) : null }
      </div>
    </div>
  );
};

Table.defaultProps = {
  tableConfig: {},
  expandable: false,
  withPagination: false,
  pageSize: 8,
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  })).isRequired,
  data: PropTypes.array.isRequired,
  tableConfig: PropTypes.object,
  expandable: PropTypes.bool,
  withPagination: PropTypes.bool,
  pageSize: PropTypes.number,
};

export default Table;
