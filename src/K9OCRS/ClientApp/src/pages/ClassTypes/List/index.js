import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Spinner } from 'reactstrap';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import PageHeader from '../../../sharedComponents/PageHeader';
import ClassTypeCard from './ClassTypeCard';

const ClassTypesList = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [classTypes, setClassTypes] = useState([]);

  useEffect(() => {
    async function getTest() {
      try {
        const res = await classTypesClient.getAllClassTypes();
        setClassTypes(res?.data);
        setLoading(false);
      } catch(err) {
        setLoading(false);
        setAlerts([{ color: 'danger', message: 'We\'re having issues retrieving the list of class types.' }]);
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
          { label: 'Class Types', active: true },
        ]}
        alerts={alerts}
      >
        <Button tag={Link} to="/Manage/ClassTypes/Add" color="primary">Add a Class Type</Button>
      </PageHeader>
      <Container className="px-5" fluid>
        { loading ? <Spinner /> : (
          <Row className="my-4" xs="1" sm="2" md="3">
            {
              classTypes?.map(ct => (
                <ClassTypeCard key={ct.id} {...ct} />
              ))
            }
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ClassTypesList;
