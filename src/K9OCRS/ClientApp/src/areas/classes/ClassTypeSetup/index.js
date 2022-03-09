import React from 'react';
import { Container, Row, Button, Input } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader';
import { Link } from 'react-router-dom';

const ClassTypeSetup = () => {
  return (
    <Container>
      <PageHeader
        title="Class Types Management"
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Class Types', path: '/Manage/ClassTypes' },
          { label: 'Class Types Setup', active: true }
        ]}
      >
        <Link to='/Manage/ClassTypes/Add' className="ms-2 p-0">
          <Button color="primary">Save Changes</Button>
        </Link>
      </PageHeader>
      <form className="d-flex flex-column">
        <Row className="g-2">
          <Input type="text" placeholder="Title" className="mb-2" value="S.T.A.R Puppy" />
          <Input type="text" placeholder="Session Length" className="mb-2" value="7 weeks"/>
          <Input type="text" placeholder="Price" className="mb-2" value="140"/>
        </Row>
        <Row className="g-2">
          <Input type="textarea" placeholder="Description" className="mb-2" rows="8"
            value="Raising a puppy can be fun and very rewarding and also a big challenge!  The K-9 Obedience Club offers classes to help you train your puppy to become a self-confident, happy and easy-to-live-with companion."
          />
        </Row>
        <Row className="g-2 mb-3 mt-5">
          <Button color="secondary" type="cancel">Cancel</Button>
        </Row>
        <Row className="g-2">
          <Button color="primary" type="submit">Submit</Button>
        </Row>
      </form>
    </Container>
  );
};

export default ClassTypeSetup;
