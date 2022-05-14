import React, { useState } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import { FormGroup, Input, Button, Label, Form, Row, Col } from 'reactstrap';
import PageBody from '../../../shared/components/PageBody';
import DogTable from './DogTable';
import './styles.scss';

const DogManagement = (props) => {
    const [alerts, setAlerts] = useState((c) => c, []);

    return (
        <div>
            <PageHeader
                title="Manage Dogs"
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Dogs', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button color="primary">Save Changes</Button>
            </PageHeader>
            <PageBody>
                <Form className="cardsurface">
                    <Row>
                        <Col xl="3">
                            <FormGroup>
                                <Label for="DogNameInput">Search</Label>
                                <Input
                                    id="DogNameInput"
                                    type="search"
                                    placeholder="Search by name of breed"
                                />
                            </FormGroup>
                        </Col>
                        <Col xl="3">
                            <FormGroup>
                                <Label for="filterByOwner">Filter by Owners</Label>
                                <Input
                                    id="filterByOwner"
                                    type="search"
                                    placeholder="Filter by owner..."
                                />
                            </FormGroup>
                        </Col>
                        <Col xl="4">
                            <FormGroup>
                                <p className="vaccinationStatusLabel">Vaccination Status</p>
                                <div id="vaccinationStatusRadio">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="vaccinationStatus"
                                        value="0"
                                        id="option0"
                                    />
                                    <label className="btn btn-outline-secondary" htmlFor="option0">
                                        All
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="vaccinationStatus"
                                        //needs value
                                        id="option1"
                                    />
                                    <label className="btn btn-outline-secondary" htmlFor="option1">
                                        Needs Update
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="vaccinationStatus"
                                        //needs value
                                        id="option2"
                                    />
                                    <label className="btn btn-outline-secondary" htmlFor="option2">
                                        Needs Review
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="vaccinationStatus"
                                        //needs value
                                        id="option3"
                                    />
                                    <label className="btn btn-outline-secondary" htmlFor="option3">
                                        Approved
                                    </label>
                                </div>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
                <DogTable />
            </PageBody>
        </div>
    );
};

export default DogManagement;
