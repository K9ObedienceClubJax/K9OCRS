import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import PageHeader from 'src/shared/components/PageHeader';
import selectors from '../../../../shared/modules/selectors';
import PageBody from 'src/shared/components/PageBody';

const AppDetails = (props) => {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [appData, setAppData] = useState([]);

    useEffect(() => {
        async function getTest() {
                try {
                    const res = await axios.get(`/api/Applications/${id}`);
                    setAppData(res?.data);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    setAlerts([
                        {
                            color: 'danger',
                            message: "We're having issues getting your Application information",
                        },
                    ]);
                }
        }
        getTest();
    }, [id]);


    return (
        <div>
           <PageHeader
                title="Manage Applications" 
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Applications', path: '/Manage/Applications' },
                    { label: 'Application Details', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button color="secondary" outline>Cancel</Button>
                <Button color="primary">Save Changes</Button>
            </PageHeader>
            <PageBody>
                <p>{id} | {appData.id} | {appData.mainAttendee}</p>
                <div>Application Details</div>
                <div>Class Details</div>
                <div>Dog Details</div>
            </PageBody>
            
        </div>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {}
)(AppDetails);