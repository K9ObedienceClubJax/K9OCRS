import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import DogCard from './components/DogCard';
import * as actions from '../modules/actions';
import PageHeader from '../../../shared/components/PageHeader';
import PageBody from '../../../shared/components/PageBody';

const MyDogs = (props) => {
    const { loading, dogList, getData } = props;

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        getData();
    }, []); // eslint-disable-line

    return (
        <div>
            <PageHeader
                title="My Dogs"
                breadCrumbItems={[
                    { label: 'My Account', path: '/Account' },
                    { label: 'My Dogs', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button tag={Link} to="/Account/MyDogs/Add" color="primary">
                    Add a Dog
                </Button>
            </PageHeader>
            <PageBody>
                {loading ? (
                    <Spinner />
                ) : (
                    <Row lg="2" xs="1">
                        {dogList?.map((dog) => (
                            <Col key={dog.id}>
                                <DogCard {...dog} />
                            </Col>
                        ))}
                    </Row>
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        loading: state.dogs.loading,
        dogList: state.dogs.myDogsList,
    }),
    {
        getData: actions.fetchMyDogsList,
    }
)(MyDogs);
