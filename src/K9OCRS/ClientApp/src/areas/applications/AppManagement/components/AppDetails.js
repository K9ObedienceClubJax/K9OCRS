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
        setStatus(event.target.value);
    };

    const [isPaid, setIsPaid] = useState();
    const [isRefunded, setIsRefunded] = useState();
    const [status, setStatus] = useState([]);


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
                <Row className='pb-3'>
                    <Col className='cardsurface mx-3'>
                            <h4>Application Details</h4>
                            <div className='ps-3'>
                                <Form>
                                    <p>Applicant:&nbsp;&nbsp;{appData?.modifiedByName}</p>
                                    <InputGroup >
                                        <Label for='payMethod'>Application Status:&nbsp;&nbsp;</Label>
                                        <div className='w-75'><Input
                                            bsSize="sm"
                                            className="mb-2 w-auto"
                                            id='status'
                                            name='status'
                                            type='select'
                                            onChange={handleSelectPayment}
                                        >
                                            <option value='pending'>Pending</option>
                                            <option value='active'>Active</option>
                                            <option value='completed'>Completed</option>
                                            <option value='cancelled'>Cancelled</option>
                                        </Input></div>
                                    </InputGroup> 
                                    <InputGroup check inline>
                                    <p>Payment Status&nbsp;&nbsp;
                                    <Input type='checkbox'
                                        // checked={isPaid}
                                        onChange={(e) => setIsPaid(e.target.checked)}
                                        disabled={loading} />
                                    <Label check>&nbsp;&nbsp;Paid&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                                    <Input type='checkbox'
                                        // checked={isRefunded}
                                        onChange={(e) => setIsRefunded(e.target.checked)}
                                        disabled={loading} />
                                    <Label check>&nbsp;&nbsp;Refunded</Label>
                                    </p></InputGroup>
                                    <p>Main Attendee:&nbsp;&nbsp;{appData?.mainAttendee}</p>
                                    <p>Additional Attendees:&nbsp;&nbsp;{appData?.additionalAttendees}</p>

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