import React from 'react';
import { BsCaretRightFill, BsCaretDownFill } from 'react-icons/bs';

const defaultColumns = {
  Expander: {
    id: 'expander',
    accessor: (row) => 'expander',
    Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
      <span {...getToggleAllRowsExpandedProps()}>
        {isAllRowsExpanded ? <BsCaretDownFill /> : <BsCaretRightFill />}
      </span>
    ),
    Cell: ({ row }) =>
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
        row.canExpand ? (
          <div
            className="expander"
            // {...row.getToggleRowExpandedProps({
            //   style: {
            //     // We can even use the row.depth property
            //     // and paddingLeft to indicate the depth
            //     // of the row
            //     paddingLeft: `${row.depth * 2}rem`,
            //   },
            // })}
          >
            {row.isExpanded ? <BsCaretDownFill /> : <BsCaretRightFill />}
          </div>
        ) : null,
  },
};

export default defaultColumns;