import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import PageBody from '../../../shared/components/PageBody';
import PageHeader from '../../../shared/components/PageHeader/index';
import Profile from '../../../shared/components/Profile';

function Create() {
    const [alerts, setAlerts] = useState([]);

    const navigate = useNavigate();

    return (
        <div>
            <PageHeader
                title="Create User"
                alerts={alerts}
                setAlerts={setAlerts}
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Users', path: '/Manage/Users' },
                    { label: 'Create User', active: true },
                ]}
            >
                <Button onClick={() => navigate(-1)} outline>
                    Cancel
                </Button>
                <Button form="profileForm">Create User</Button>
            </PageHeader>
            <PageBody>
                <Profile mode="create" setAlerts={setAlerts} />
            </PageBody>
        </div>
    );
}

export default Create;
