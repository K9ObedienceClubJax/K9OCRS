import React from 'react';

export default props => {
  const {
    className
  } = props;

  return (
    <button className={`btn ${className}`}>{className}</button>
  );
};
