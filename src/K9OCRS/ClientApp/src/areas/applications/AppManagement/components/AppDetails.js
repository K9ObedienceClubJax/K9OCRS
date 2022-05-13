import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, Label, Input, InputGroup, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import PageHeader from 'src/shared/components/PageHeader';
import selectors from '../../../../shared/modules/selectors';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';
import PageBody from 'src/shared/components/PageBody';
import SectionData from './SectionData';
import DogData from './DogData';

const AppDetails = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [appData, setAppData] = useState({});

    const [isPaidStatus, setIsPaidStatus] = useState(false);
    const [isRefunded, setIsRefunded] = useState(false);
    const [payStatus, setPayStatus] = useState('');

    const handleSelectPayment = (event) => {
        setPayStatus(event.target.value);
    };

    const handleCheckPaid = () => {
        setIsPaidStatus(!isPaidStatus);
    };

    const handleIsRefunded = () => {
        setIsRefunded(!isRefunded);
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

    const appDataString = JSON.stringify(appData);
    useEffect(() => {
        setIsPaidStatus(appData?.isPaid);
        setIsRefunded(appData?.isRefunded);
        setPayStatus(appData?.status);
    }, [appDataString]); // eslint-disable-line

    async function saveData(event) {
        const appUpdateData = {
            ...appData,
            isPaid: isPaidStatus,
            isRefunded: isRefunded,
            status: payStatus,
        };

        const id = appData?.id;
        if (id) {
            try {
                const response = await axios.put(`/api/applications/${appData?.id}`, appUpdateData);
                navigate('/Manage/Applications');
                return response.data;
            } catch (err) {
                console.error(err);
            }
        }
    }

    const onSubmit = async (event) => {
        try {
            await saveData();
            alert('Your changes were saved');
        } catch (e) {
            alert('Something went wrong! Changes were not saved');
        }
    };

    const cancelHandler = async (event) => navigate(-1);

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
                <Button color="secondary" outline onClick={cancelHandler}>
                    Cancel
                </Button>
                <Button color="primary" onClick={onSubmit}>
                    Save Changes
                </Button>
            </PageHeader>
            <PageBody>
                {loading && <Spinner />}
                <LastUpdatedNote
                    modifiedByID={appData?.modifiedByID}
                    modifiedByName={appData?.modifiedByName}
                    modifiedDate={appData?.modifiedDate}
                />
                <Row className="pb-3">
                    <Col className="cardsurface mx-3">
                        <h4>Application Details</h4>
                        <div className="ps-3">
                            <p className="my-1">
                                <b>Applicant:</b>&nbsp;&nbsp;{appData?.modifiedByName}
                            </p>
                            <InputGroup>
                                <Label for="payMethod" className="my-1">
                                    <b>Application Status:</b>&nbsp;&nbsp;
                                </Label>
                                <div className="w-75">
                                    <Input
                                        bsSize="sm"
                                        className="mb-2 w-auto"
                                        id="status"
                                        name="status"
                                        type="select"
                                        onChange={handleSelectPayment}
                                    >
                                        {appData?.status === 'Pending' ? (
                                            <option value="Pending" selected>
                                                Pending
                                            </option>
                                        ) : (
                                            <option value="Pending">Pending</option>
                                        )}
                                        {appData?.status === 'Active' ? (
                                            <option value="Active" selected>
                                                Active
                                            </option>
                                        ) : (
                                            <option value="Active">Active</option>
                                        )}
                                        {appData?.status === 'Completed' ? (
                                            <option value="Completed" selected>
                                                Completed
                                            </option>
                                        ) : (
                                            <option value="Completed">Completed</option>
                                        )}
                                        {appData?.status === 'Cancelled' ? (
                                            <option value="Cancelled" selected>
                                                Cancelled
                                            </option>
                                        ) : (
                                            <option value="Cancelled">Cancelled</option>
                                        )}
                                    </Input>
                                </div>
                            </InputGroup>
                            <p className="my-1">
                                <b>Payment Status: </b>&nbsp;&nbsp;
                                <Input
                                    type="checkbox"
                                    checked={isPaidStatus}
                                    onChange={handleCheckPaid}
                                    disabled={loading}
                                />
                                <label check>&nbsp;&nbsp;Paid&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                <Input
                                    type="checkbox"
                                    checked={isRefunded}
                                    onChange={handleIsRefunded}
                                    disabled={loading}
                                />
                                <label check>&nbsp;&nbsp;Refunded</label>
                            </p>
                            <p className="my-1">
                                <b>Main Attendee:</b>&nbsp;&nbsp;{appData?.mainAttendee}
                            </p>
                            <p className="my-1">
                                <b>Additional Attendees:</b>&nbsp;&nbsp;
                                {appData?.additionalAttendees}
                            </p>
                        </div>
                    </Col>
                    <Col className="cardsurface mx-3">
                        <SectionData id={appData?.classSectionID} />
                    </Col>
                </Row>
                <Row className="pt-3">
                    <Col className="cardsurface mx-3">
                        <DogData id={appData?.dogID} />
                    </Col>
                </Row>
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
