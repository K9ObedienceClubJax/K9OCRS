import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'reactstrap';
import ClassTypeGrid from './ClassTypeGrid';

const ClassTypesDashboard = () => {
  const [test, setTest] = useState([]);
  useEffect(() => {
    async function getTest() {
      try {
        const res = await axios.get('/api/classtypes');
        console.log(res);
        setTest(res?.data);
      } catch(err) {
        console.log(err?.response);
        setTest(err?.response?.data);
      }
    }
    getTest();
  }, []);

  return (
    <Container>
      <h1>Class Types Management</h1>
      <pre>{JSON.stringify(test, null, 2)}</pre>
      <ClassTypeGrid />
    </Container>
  );
};

export default ClassTypesDashboard;
