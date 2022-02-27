import React from 'react';
import Illustration from './illustration';

import './styles.scss';

const notFoundPage = () => {
  return (
    <div className="notFound">
      <p className="notFound__title display-3">Whoops, looks like you're lost</p>
      <p className="notFound__subtitle h2 text-primary">We couldn't find the page you're looking for</p>
      <div className='notFound__illustration-container'>
        <Illustration className="notFound__illustration" />
      </div>
    </div>
  );
};

export default notFoundPage;
