import React, { useState } from 'react';
import { Button } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader/index';
import Profile from '../../../shared/components/Profile';

function Users() {
  const [alerts, setAlerts] = useState([]);
  return (
    <div>
      <PageHeader title='User Setup' alerts={alerts}>
        <Button color='primary' form='profileForm'>
          Save Changes
        </Button>
      </PageHeader>
      <Profile mode='inspect' setAlerts={setAlerts} />
    </div>
  );
}

export default Users;
