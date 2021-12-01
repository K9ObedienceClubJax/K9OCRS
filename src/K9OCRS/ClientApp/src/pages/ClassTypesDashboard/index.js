import React from 'react';
import { Container } from 'reactstrap';
import ClassTypeGrid from './ClassTypeGrid';

const ClassTypesDashboard = () => {
  return (
    <Container>
      <h1>Class Types Management</h1>
      <ClassTypeGrid />
    </Container>
  );
};

export default ClassTypesDashboard;
