import React, { useState } from 'react';
import { connect } from 'react-redux';
import selectors from '../../shared/modules/selectors';
import { Row, Col, Button } from 'reactstrap';
import PageHeader from '../../shared/components/PageHeader';
import SideNav from '../../shared/components/SideNav';
import Profile from '../../shared/components/Profile';

const MyAccount = (props) => {
  const { currentUser = null } = props;
  console.log(currentUser.userRoleID);
  const [alerts, setAlerts] = useState([]);

  return (
    <div>
      <PageHeader title='My Account' alerts={alerts}>
        <Button color='primary' form='profileForm'>
          Save Changes
        </Button>
      </PageHeader>
      <Row>
        <Col lg='2'>
          <SideNav current={0} userRoleID={currentUser.userRoleID} />
        </Col>
        <Col lg={{ size: 8, offset: 1 }}>
          <Profile mode='default' setAlerts={setAlerts} />
        </Col>
      </Row>
    </div>
  );
};

export default connect((state) => ({
  currentUser: selectors.selectCurrentUser(state),
}))(MyAccount);
