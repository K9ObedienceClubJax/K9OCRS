import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormGroup, Input, Button, Label, Form, Row, Col } from 'reactstrap';
import PageHeader from 'src/shared/components/PageHeader';
import PageBody from 'src/shared/components/PageBody';
import Table from 'src/shared/components/Table';
import columns from './Columns';
import * as actions from '../modules/actions';
import './styles.scss';

const DogManagement = (props) => {
    const {
        loading,
        // loadingOptions,
        dogList,
        // ownerOptions,
        getDogsList,
        // getFilterOptions,
    } = props;
    const isMounted = useRef(false);

    const [alerts, setAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleDogs, setVisibleDogs] = useState([]);

    useEffect(() => {
        getDogsList({ setAlerts });
        // getFilterOptions({ setAlerts });
    }, []); // eslint-disable-line

    const dogListString = JSON.stringify(dogList);
    useEffect(() => {
        if (!loading && isMounted.current) {
            setVisibleDogs(dogList);
        } else {
            isMounted.current = true;
        }
    }, [dogListString]); // eslint-disable-line

    useEffect(() => {
        if (searchQuery) {
            setVisibleDogs(
                dogList?.filter((d) => {
                    const nameMatch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const breedMatch = d.breed.toLowerCase().includes(searchQuery.toLowerCase());
                    return nameMatch || breedMatch;
                })
            );
        } else {
            setVisibleDogs(dogList);
        }
    }, [searchQuery]); // eslint-disable-line

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
                <Button tag={Link} color="primary" to="/Manage/Dogs/Add">
                    Add a Dog
                </Button>
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
                                    placeholder="Search by name or breed"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        {/* <Col xl="3">
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
                        </Col> */}
                    </Row>
                </Form>
                <Table columns={columns} data={visibleDogs} pageSize={12} withPagination />
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => {
        const dogsState = state.dogs;
        return {
            loading: dogsState.loading,
            loadingOptions: dogsState.loadingOptions,
            dogList: dogsState.dogList,
            ownerOptions: dogsState.ownerOptions,
        };
    },
    {
        getDogsList: actions.fetchDogList,
        getFilterOptions: actions.loadOptions,
    }
)(DogManagement);
