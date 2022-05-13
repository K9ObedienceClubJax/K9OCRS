import React, { useState } from 'react';
import { Row, Button } from 'reactstrap';
import PageHeader from '../../shared/components/PageHeader';
import Profile from '../../shared/components/Profile';

const MyAccount = (props) => {
    const [alerts, setAlerts] = useState([]);

    return (
        <div>
            <PageHeader title="My Account" alerts={alerts} setAlerts={setAlerts}>
                <Button color="primary" form="profileForm">
                    Save Changes
                </Button>
            </PageHeader>
            <Row>
                <Profile mode="default" setAlerts={setAlerts} />
            </Row>
        </div>
    );
};

export default MyAccount;
