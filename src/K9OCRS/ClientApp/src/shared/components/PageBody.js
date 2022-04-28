import React from 'react';
import classNames from 'classnames';

// This is a very small wrapper to apply "overflow-x: hidden" to anything below the PageHeader component
const PageBody = ({ className = '', children }) => (
    <div className={classNames('pagebody px-4 px-mb-5', className)}>{children}</div>
);

export default PageBody;
