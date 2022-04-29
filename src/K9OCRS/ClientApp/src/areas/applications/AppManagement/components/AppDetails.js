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

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [appData, setAppData] = useState([]);

    const handleSelectPayment = (event) => {
        setPayStatus(event.target.value);
    };

    const [isPaidStatus, setIsPaidStatus] = useState(false);
    const [isRefunded, setIsRefunded] = useState(false);
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

    async function saveData(event) {
       // event.preventDefault();

        const id = appData?.id;
        if (id) {
            try {
              const response = await axios.put(`/api/applications/ ${id}`, appUpdateData, {
                headers: {
                  "x-access-token": "token-value",
                },
              });
              navigate('/Manage/Applications');
              return response.data;
              
            } catch (err) {
              console.error(err);
            }
           }
        };

        const onSubmit = async (event) => {
            event.preventDefault();
            try {
                await saveData();
                alert('Your changes were saved');
            }
            catch (e) {alert('Something went wrong! Changes were not saved')};
        }


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
                <Button color="primary" onClick={onSubmit}>Save Changes</Button>
            </PageHeader>
            <PageBody>
                <Row className='pb-3'>
                    <Col className='cardsurface mx-3'>
                            <h4>Application Details</h4>
                            <div className='ps-3'>
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
{/*                                 <InputGroup check inline>
                                <p className='my-1'><b>Payment Status</b>&nbsp;&nbsp;
                                <Input type='checkbox'
                                    checked={isPaidStatus}
                                    onChange={handleCheckPaid}
                                    disabled={loading} />
                                <Label check>&nbsp;&nbsp;Paid&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                                <Input type='checkbox'
                                    checked={isRefunded}
                                    onChange={(e) => setIsRefunded(e.target.checked)}
                                    disabled={loading} />
                                <Label check>&nbsp;&nbsp;Refunded</Label>
                                </p ></InputGroup> */}

                                <InputGroup>
                                <Label for='payment'><b>Payment Status:  &nbsp;&nbsp;</b></Label>
                                <div>This applicant has paid: &nbsp;&nbsp;
                                    <Label check>
                                    <Input type='radio' name='radio1' onClick={() => setIsPaidStatus(true)} />{''} Yes &nbsp;&nbsp;                                   </Label>

                                    <Label check>
                                        <Input type='radio' name='radio1' onClick={() => setIsPaidStatus(false)} />{''} No
                                    </Label>
                                </div>
                                </InputGroup>
                                <p>Paid status: {isPaidStatus ? 'Yes' : 'No'}</p>

                                <InputGroup>
                                <Label for='payment'><b>Refund Status: &nbsp;&nbsp; </b></Label>
                                <div>This applicant has been refunded: &nbsp;&nbsp;
                                    <Label check>
                                        <Input type='radio' name='radio2' onClick={() => setIsRefunded(true)} /> Yes&nbsp;&nbsp;
                                    </Label>

                                    <Label check>
                                        <Input type='radio' name='radio2' onClick={() => setIsRefunded(false)} /> No
                                    </Label>
                                </div>
                                </InputGroup>
                                <p>Refund status: {isRefunded ? 'Yes' : 'No'}</p>

                                <p className='my-1'><b>Main Attendee:</b>&nbsp;&nbsp;{appData?.mainAttendee}</p>
                                <p className='my-1'><b>Additional Attendees:</b>&nbsp;&nbsp;{appData?.additionalAttendees}</p>
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