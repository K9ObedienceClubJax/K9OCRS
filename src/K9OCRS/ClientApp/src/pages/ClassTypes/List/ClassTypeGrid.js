import React from 'react';
import { Row } from 'reactstrap';
import ClassTypeCard from './ClassTypeCard';

const ClassTypeGrid = props => {
  const { data } = props;

  return (
    <Row className="my-4" xs="1" sm="2" md="3">
      {
        data?.map(ct => (
          <ClassTypeCard {...ct} />
        ))
      }
    </Row>
  );
};

export default ClassTypeGrid;
