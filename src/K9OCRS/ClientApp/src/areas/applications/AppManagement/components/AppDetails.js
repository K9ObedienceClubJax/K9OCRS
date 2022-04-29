import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, Form, Label, Input, InputGroup } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from 'src/shared/components/PageHeader';
import selectors from '../../../../shared/modules/selectors';
import PageBody from 'src/shared/components/PageBody';
import SectionData from './SectionData';
import DogData from './DogData';

const AppDetails = (props) => {
    const { id } = useParams();
    const navigate=useNavigate();

    const [loading, setLoading] = useState(true); // eslint-disable-line
    const [alerts, setAlerts] = useState([]);

    const [appData, setAppData] = useState([]);

    const handleSelectPayment = (event) => {
        setPayStatus(event.target.value);
    };

    const [isPaidStatus, setIsPaidStatus] = useState(appData?.isPaid);
    const [isRefunded, setIsRefunded] = useState(appData?.isRefunded);
    const [payStatus, setPayStatus] = useState([]);

    const handleCheckPaid = () => setIsPaidStatus(!isPaidStatus);

    const appUpdateData = {
        id: appData?.id,
        classTypeID: appData?.classTypeID,
        classSectionID: appData?.classSectionID,
        dogID: appData?.dogID,
        status: payStatus,
        mainAttendee: appData?.mainAttendee,
        additionalAttendees:appData?.additionalAttendees,
        paymentMethod: appData?.paymentMethod,
        isPaid: isPaidStatus,
        isRefunded: isRefunded
    };


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
