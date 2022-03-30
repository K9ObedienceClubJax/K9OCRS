import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader/index';
import Profile from '../../../shared/components/Profile';

function Users() {
    const [alerts, setAlerts] = useState([]);
    const { userId } = useParams();
    return (
        <div>
            <PageHeader
                title="User Setup"
                alerts={alerts}
                setAlerts={setAlerts}
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Users', path: '/Manage/Users' },
                    { label: 'User Setup', active: true },
                ]}
            >
                <Button color="primary" form="profileForm">
                    Save Changes
                </Button>
            </PageHeader>
            <Profile mode="inspect" setAlerts={setAlerts} paramsId={userId} />
        </div>
    );
}

export default Users;
