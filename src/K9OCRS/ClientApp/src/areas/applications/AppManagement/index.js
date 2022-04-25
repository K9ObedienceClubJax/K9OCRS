import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Spinner, Form, Row, Col } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader';
import Table from '../../../shared/components/Table';
import PageBody from '../../../shared/components/PageBody';
import selectors from '../../../shared/modules/selectors';
import sectionColumns from './components/sectionColumns';


const AppManagement = (props) => {
/*     const {
        classesState: { includeArchived, includeDrafts, classList },
        fetchClassList,
        toggleIncludeArchived,
        toggleIncludeDrafts,
    } = props;
 */

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState((c) => c, []);
    const [appDetails, setAppDetails] = useState([]);

    //Not implemented in API:
   //const [useClassName, setUseClassName] = useState('');
   // const [usePaid, setUsePaid] = useState('');
   // const [useRefunded, setUseRefunded] = useState(true);

    const [useDogId, setUseDogId] = useState('');
    const [usePayment, setUsePayment] = useState('');

    const [usePending, setusePending] = useState(true);
    const [useActive, setUseActive] = useState(false);
    const [useCompleted, setUseCompleted] = useState(false);
    const [useCancelled, setUseCancelled] = useState(false);

    useEffect(() => {
        async function getTest() {
                try {
                    const res = await axios.get(`/api/Applications`, {params: {useDogId, usePayment, usePending, useActive, useCompleted, useCancelled}});
                    setAppDetails(res?.data);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    setAlerts([
                        {
                            color: 'danger',
                            message: "We're having issues getting the applications",
                        },
                    ]);
                }

        }
        getTest();
    }, [useDogId, usePayment, usePending, useActive, useCompleted, useCancelled]);

    return (
        <div>
            <PageHeader
                title="Manage Applications"
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Applications', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
            </PageHeader>
            <PageBody>
                <Form>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for='classTypeInput'>Class Type</Label>
                                <Input
                                    id="classTypeInput"
                                    name='classType'
                                    placeholder='Type a class name here'
                                    type='text'
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for='dogInput'>Dog</Label>
                                <Input
                                    id='dogInput'
                                    name='dogInput'
                                    placeholder='Search by Dog Name'
                                    type='text'
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for='payMethod'>Payment Method</Label>
                                <Input
                                    id='payMethod'
                                    name='paySelect'
                                    type='select'
                                >
                                <option value='allPayments' selected>All Payment Types</option>
                                <option value='paypal'>Paypal</option>
                                <option value='zelle'>Zelle</option>
                                <option value='check'>Check</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Row>
                                <Label for='payStatus'>Shown Payment Statuses:</Label>
                                </Row>
                                <Row>
                                    <Col>
                                <FormGroup check inline>
                                    <Input type='checkbox' 
                                        onChange=''
                                        disabled={loading}                                    />
                                    <Label check>Paid</Label>
                                </FormGroup></Col>
                                <Col>
                                <FormGroup check inline>
                                    <Input type='checkbox'
                                        onChange=''
                                        disabled={loading} />
                                    <Label check>Refunded</Label>
                                </FormGroup></Col></Row>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Label for='shownStatus'>Shown Statuses</Label>
                    </Row>
                        <FormGroup check inline>
                            <Input type='checkbox' 
                                checked=''
                                onChange=''
                                disabled={loading}/>
                            <Label check>Pending</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Input type='checkbox'
                                checked=''
                                onChange=''
                                disabled={loading}/>
                            <Label check>Active</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Input type='checkbox'
                                checked=''
                                onChange=''
                                disabled={loading} />
                            <Label check>Completed</Label>
                        </FormGroup> 
                        <FormGroup check inline>
                            <Input type='checkbox'
                                checked=''
                                onChange=''
                                disabled={loading}                             />
                            <Label check>Cancelled</Label>
                        </FormGroup>

                        {/* <FormGroup className="me-5" check>
                        <Input
                            type="checkbox"
                            checked={includeArchived}
                            onChange={() => toggleIncludeArchived()}
                            disabled={loading}
                        />
                        <Label check>Show Archived Types</Label>
                        </FormGroup> */}
                </Form>
                <Table
                        columns={sectionColumns}
                        data={appDetails}
                        pageSize={12}
                        withPagination
                    />

          
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {}
)(AppManagement);