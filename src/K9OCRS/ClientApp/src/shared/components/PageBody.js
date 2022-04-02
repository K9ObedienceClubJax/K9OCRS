import React from 'react';
import classNames from 'classnames';

// This is a very small wrapper to apply "overflow-x: hidden" to anything below the PageHeader component
const PageBody = ({ className = '', children }) => (
    <div className={classNames('pagebody', className)}>{children}</div>
);

export default PageBody;
