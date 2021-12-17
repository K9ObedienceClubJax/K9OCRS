import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import PageHeader from '../../../sharedComponents/PageHeader';
import ClassTypeGrid from './ClassTypeGrid';

const ClassTypesDashboard = () => {
  const [classTypes, setClassTypes] = useState([]);

  useEffect(() => {
    async function getTest() {
      try {
        const res = await classTypesClient.getAllClassTypes();
        console.log(res);
        setClassTypes(res?.data);
      } catch(err) {
        console.log(err?.response);
        setClassTypes(err?.response?.data);
      }
    }
    getTest();
  }, []);

  return (
    <div>
      <PageHeader
        title="Class Types Management"
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Class Types', active: true }
        ]}
      >
        <Button tag={Link} to="/Manage/ClassTypes/Add" color="primary">Add a Class Type</Button>
      </PageHeader>
      <Container className="px-5" fluid>

      <ClassTypeGrid data={classTypes} />
      </Container>
    </div>
  );
};

export default ClassTypesDashboard;
