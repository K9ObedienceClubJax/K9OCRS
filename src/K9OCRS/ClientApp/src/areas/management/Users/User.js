import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import * as actions from 'src/areas/accounts/modules/actions';
import PageBody from '../../../shared/components/PageBody';
import PageHeader from '../../../shared/components/PageHeader/index';
import Profile from '../../../shared/components/Profile';

function Users(props) {
    const { archiveUser, unarchiveUser, deleteUser } = props;

    const [alerts, setAlerts] = useState([]);
    const [isArchived, setIsArchived] = useState(false);
    const { userId } = useParams();

    const navigate = useNavigate();

    const handleArchive = () => {
        if (
            window.confirm(
                "This user won't be able to log into their account until they are unarchived."
            )
        ) {
            archiveUser(userId);
        }
    };

    const handleUnarchive = () => {
        if (window.confirm('This user will be able to log into this account.')) {
            unarchiveUser(userId);
        }
    };

    const handleDelete = () => {
        if (
            window.confirm(
                'This action cannot be reversed! the account will be permanently gone, consider archiving it if you may need it back.'
            )
        ) {
            deleteUser(userId);
            navigate('/Manage/Users');
        }
    };

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
                <Button onClick={handleDelete} color="danger" outline>
                    Delete
                </Button>
                {isArchived ? (
                    <Button onClick={handleUnarchive} color="secondary">
                        Unarchive
                    </Button>
                ) : (
                    <Button onClick={handleArchive} color="secondary">
                        Archive
                    </Button>
                )}
                <Button color="primary" form="profileForm">
                    Save Changes
                </Button>
            </PageHeader>
            <PageBody>
                <Profile
                    mode="inspect"
                    setAlerts={setAlerts}
                    paramsId={userId}
                    archivedStatusSetter={setIsArchived}
                />
            </PageBody>
        </div>
    );
}

export default connect((state) => ({}), {
    archiveUser: actions.archiveUser,
    unarchiveUser: actions.unarchiveUser,
    deleteUser: actions.deleteUser,
})(Users);
