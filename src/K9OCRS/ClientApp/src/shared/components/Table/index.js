import React, { useMemo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTable, useExpanded, usePagination } from 'react-table';
import { useSearchParams } from 'react-router-dom';
import CustomPagination from '../Pagination';
import defaultColumns from './columns';

import './style.scss';

function debounce(fn, ms) {
    let timer;
    return (_) => {
        clearTimeout(timer);
        timer = setTimeout((_) => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
}

const Table = (props) => {
    const { columns, data, tableConfig, expandable, withPagination, pageSize, footnotes } = props;

    const plugins = [];
    const initialState = {};

    const isMounted = useRef(false);

    const activeColumns = useMemo(() => {
        const result = columns;
        // Insert expander as first column
        if (expandable && !result.some((c) => c.id === defaultColumns.Expander.id))
            result.splice(0, 0, defaultColumns.Expander);

        return result;
    }, [JSON.stringify(columns), expandable]); // eslint-disable-line

    const initExpanded = useMemo(
        () =>
            expandable &&
            data?.reduce((prev, curr) => {
                prev[curr.id] = true;
                return prev;
            }, {}),
        [expandable, data]
    );

    if (expandable) {
        plugins.push(useExpanded);
        initialState.expanded = initExpanded;
    }

    const [searchParams, setSearchParams] = useSearchParams();

    if (withPagination) {
        plugins.push(usePagination);
        initialState.pageSize = pageSize;
        if (searchParams.has('page')) {
            initialState.pageIndex = searchParams.get('page') - 1;
        } else {
            initialState.pageIndex = 0;
        }
    }

    const tableInstance = useTable(
        {
            columns: activeColumns,
            data,
            getRowId: (row, idx, parent) => (parent ? [parent.id, row.id].join('.') : row.id),
            ...tableConfig,
            initialState,
        },
        ...plugins
    );

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

    // This actually just updates the page param
    // the actual page change is handled by useEffect
    const handlePageChange = (targetPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', targetPage + 1);
        setSearchParams(params);
    };

    const activeRows = withPagination ? page : rows;

    const cn = 'k9-table';

    const collapseWidth = '(min-width: 992px)';
    const [breakpointHit, setBreakpointHit] = useState(window.matchMedia(collapseWidth).matches);

    useEffect(() => {
        const debouncedHandleResize = debounce(function updateBreakpointHit() {
            setBreakpointHit(window.matchMedia(collapseWidth).matches);
        }, 1000);

        window.addEventListener('resize', debouncedHandleResize);

        return (_) => window.removeEventListener('resize', debouncedHandleResize);
    });

    // reset the page if the row count changes
    useEffect(() => {
        if (isMounted.current) {
            const params = new URLSearchParams(searchParams);
            params.delete('page');
            setSearchParams(params);
        } else {
            isMounted.current = true;
        }
    }, [rows.length]); // eslint-disable-line

    // actually change page when the param changes
    const searchParamsString = searchParams.toString();
    useEffect(() => {
        if (searchParams.has('page')) {
            gotoPage(searchParams.get('page') - 1);
        } else {
            gotoPage(0);
        }
    }, [searchParamsString]); // eslint-disable-line

    const shouldHideCell = (value, canExpand) => {
        // gotta do this because we still want 0 or false values which would get caught
        // in the crossfire if we did something like const valuePresent = !!value;
        const valuePresent = value !== null && value !== undefined && value !== '';
        // exclude the expander column when we can't expand
        const valueNotExcluded = value !== 'expander' || canExpand;
        return !(valuePresent && valueNotExcluded);
    };

    return (
        <div className={cn}>
            <table className={`${cn}__table`} {...getTableProps()}>
                <thead>
                    {
                        // Loop over the header rows
                        headerGroups.map((headerGroup) => (
                            // Apply the header row props
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    // Loop over the headers in each row
                                    headerGroup.headers.map((column) => (
                                        // Apply the header cell props
                                        <th {...column.getHeaderProps()}>
                                            {
                                                // Render the header
                                                column.render('Header')
                                            }
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                    {
                        // Loop over the table rows
                        activeRows.map((row) => {
                            // Prepare the row for display
                            prepareRow(row);
                            const isChildRow = `${row.id}`.includes('.');
                            const toggleProps =
                                !isChildRow && row.canExpand ? row.getToggleRowExpandedProps() : {};
                            return (
                                // Apply the row props
                                <tr
                                    className={isChildRow ? '' : 'k9-table__top-row'}
                                    {...row.getRowProps()}
                                    {...toggleProps}
                                >
                                    {
                                        // Loop over the rows cells
                                        row.cells.map((cell) => {
                                            const hideCell = shouldHideCell(
                                                cell.value,
                                                row.canExpand
                                            );

                                            if (!breakpointHit && hideCell) {
                                                return null;
                                            }

                                            const headingData =
                                                typeof cell?.column?.Header === 'string'
                                                    ? cell?.column?.Header
                                                    : '';

                                            // Apply the cell props
                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    data-heading={headingData}
                                                >
                                                    {!breakpointHit && (
                                                        <>
                                                            {headingData && (
                                                                <div className="k9-table__floating-label">
                                                                    {headingData}
                                                                </div>
                                                            )}
                                                            <div className="k9-table__cell">
                                                                {
                                                                    // Render the cell contents
                                                                    cell.render('Cell')
                                                                }
                                                            </div>
                                                        </>
                                                    )}
                                                    {breakpointHit &&
                                                        // Render the cell contents
                                                        cell.render('Cell')}
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <div className={`${cn}__extras-container`}>
                {footnotes?.length > 0 ? (
                    <div className={`${cn}__footnotes-container`}>
                        {footnotes.map((f, idx) => (
                            <p key={idx}>{f}</p>
                        ))}
                    </div>
                ) : null}
                {withPagination ? (
                    <div className={`${cn}__pagination-container`}>
                        <CustomPagination
                            className={`${cn}__pagination`}
                            onPageChange={handlePageChange}
                            totalCount={rows.length}
                            currentPage={state.pageIndex}
                            pageSize={state.pageSize}
                            useTablePagination
                        />
                    </div>
                ) : null}
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
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    tableConfig: PropTypes.object,
    expandable: PropTypes.bool,
    withPagination: PropTypes.bool,
    pageSize: PropTypes.number,
};

export default Table;
