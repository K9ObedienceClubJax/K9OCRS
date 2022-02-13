import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import selectors from '../../shared/modules/selectors';
import { Row, Col, Button, Input } from 'reactstrap';
import PageHeader from '../../shared/components/PageHeader';
import SideNav from '../../shared/components/SideNav';
import Profile from '../../shared/components/Profile';
// import image from '../../../public/K9Storage/profilepictures/UserPlaceholder.png';

const MyAccount = (props) => {
  const { currentUser = null } = props;
  console.log(currentUser.userRoleID);
  const [alerts, setAlerts] = useState([]);

  return (
    <div>
      <PageHeader title='My Account' alerts={alerts}>
        <Button color='primary' form='myForm'>
          Save Changes
        </Button>
      </PageHeader>
      <Row>
        <Col lg='2'>
          <SideNav current={0} userRoleID={currentUser.userRoleID} />
        </Col>
        <Col lg={{ size: 8, offset: 1 }}>
          <Profile mode='default' />
        </Col>
      </Row>
    </div>
  );
};

export default connect((state) => ({
  currentUser: selectors.selectCurrentUser(state),
}))(MyAccount);
