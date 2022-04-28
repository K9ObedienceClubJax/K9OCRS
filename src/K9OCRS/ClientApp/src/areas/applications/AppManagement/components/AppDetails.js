import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Spinner, Row, Col, Form, FormGroup, Card, CardBody, CardTitle, CardText, Label, Input, InputGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import PageHeader from 'src/shared/components/PageHeader';
import selectors from '../../../../shared/modules/selectors';
import PageBody from 'src/shared/components/PageBody';
import SectionData from './SectionData';
import DogData from './DogData';

const AppDetails = (props) => {


    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [appData, setAppData] = useState([]);

    const handleSelectPayment = (event) => {
        setPayStatus(event.target.value);
    };

    const [isPaid, setIsPaid] = useState();
    const [isRefunded, setIsRefunded] = useState();
    const [payStatus, setPayStatus] = useState([]);

    const handleCheckPaid = () => {
        setIsPaid(!isPaid);
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

    async function handleSubmit() {
        const id = appData?.id;
        if (id) {
            const appUpdateData = {
                id: appData?.id,
                classTypeID: appData?.classTypeID,
                classSectionID: appData?.classSectionID,
                dogID: appData?.dogID,
                status: payStatus,
                mainAttendee: appData?.mainAttendee,
                additionalAttendees:appData?.additionalAttendees,
                paymentMethod: appData?.paymentMethod,
                isPaid: true,
                isRefunded: isRefunded
            };
            try {
              const response = await axios.put(`/api/applications/ ${id}`, appUpdateData, {
                headers: {
                  "x-access-token": "token-value",
                },
              });
              return response.data;
            } catch (err) {
              console.error(err);
            }
          }
        };


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
                <Button color="secondary" outline >Cancel</Button>
                <Button color="primary" onClick={handleSubmit()}>Save Changes</Button>
            </PageHeader>
            <PageBody>
                <Row className='pb-3'>
                    <Col className='cardsurface mx-3'>
                            <h4>Application Details</h4>
                            <div className='ps-3'>
                                <Form>
                                    <p className='my-1'><b>Applicant:</b>&nbsp;&nbsp;{appData?.modifiedByName}</p>
                                    <InputGroup >
                                        <Label for='payMethod' className='my-1'><b>Application Status:</b>&nbsp;&nbsp;</Label>
                                        <div className='w-75'><Input
                                            bsSize="sm"
                                            className="mb-2 w-auto"
                                            id='status'
                                            name='status'
                                            type='select'
                                            onChange={handleSelectPayment}
                                        >
                                            {appData?.status === 'Pending' ? <option value='Pending' selected>Pending</option> : <option value='Pending'>Pending</option>}
                                            {appData?.status === 'Active' ? <option value='Active' selected>Active</option> : <option value='Active'>Active</option>}
                                            {appData?.status === 'Completed' ? <option value='Completed' selected>Completed</option> : <option value='Completed'>Completed</option>}
                                            {appData?.status === 'Cancelled' ? <option value='Cancelled' selected>Cancelled</option> : <option value='Cancelled'>Cancelled</option>}
                                        </Input></div>
                                    </InputGroup> 
                                    <InputGroup check inline>
                                    <p className='my-1'><b>Payment Status</b>&nbsp;&nbsp;
                                    <Input type='checkbox'
                                        id='isPaid'
                                        name='isPaid'
                                        value='paid'
                                        checked={isPaid}
                                        onChange={handleCheckPaid}
                                        disabled={loading} />
                                    <Label check>&nbsp;&nbsp;Paid&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                                    <Input type='checkbox'

                                        onChange={(e) => setIsRefunded(e.target.checked)}
                                        disabled={loading} />
                                    <Label check>&nbsp;&nbsp;Refunded</Label>
                                    </p ></InputGroup>
                                    <p className='my-1'><b>Main Attendee:</b>&nbsp;&nbsp;{appData?.mainAttendee}</p>
                                    <p className='my-1'><b>Additional Attendees:</b>&nbsp;&nbsp;{appData?.additionalAttendees}</p>

                                </Form>

                            </div>
                    </Col>
                    <Col className='cardsurface mx-3'>
                        <SectionData id={appData?.classSectionID} />
                    </Col>

                </Row>
                <Row className='pt-3'>
                <Col className='cardsurface mx-3'>
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