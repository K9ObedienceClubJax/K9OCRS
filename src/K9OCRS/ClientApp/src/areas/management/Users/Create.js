import React, { useState } from 'react';
import { Button } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader/index';
import Profile from '../../../shared/components/Profile';

function Create() {
  const [alerts, setAlerts] = useState([]);
  return (
    <div>
      <PageHeader title='Create User' alerts={alerts} setAlerts={setAlerts}>
        <Button outline>Cancel</Button>
        <Button form='profileForm'>Create User</Button>
      </PageHeader>
      <Profile mode='create' setAlerts={setAlerts} />
    </div>
  );
}

export default Create;
