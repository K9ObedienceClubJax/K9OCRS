import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Button, Input, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';

const ClassTypeSetup = (props) => {
    const { classType, fetchClassDetails } = props;

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const { classTypeId } = useParams();

    useEffect(() => {
        fetchClassDetails({ classTypeId, setLoading, setAlerts });
    }, [classTypeId]); // eslint-disable-line

    return (
        <div>
            <PageHeader
                title={`Class Type: ${classType?.title ?? 'Loading...'}`}
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Classes', path: '/Manage/Classes' },
                    {
                        label: `Class Type: ${
                            classType?.title ?? 'Loading...'
                        }`,
                        active: true,
                    },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button
                    tag={Link}
                    to="/Manage/Classes"
                    color="secondary"
                    outline
                >
                    Cancel
                </Button>
                <Button onClick={() => {}} color="primary">
                    Save Changes
                </Button>
            </PageHeader>
            {loading ? (
                <Spinner />
            ) : (
                <form className="d-flex flex-column">
                    <Row className="g-2">
                        <Input
                            type="text"
                            placeholder="Title"
                            className="mb-2"
                            value={classType?.title}
                        />
                        <Input
                            type="text"
                            placeholder="Session Length"
                            className="mb-2"
                            value={classType?.duration}
                        />
                        <Input
                            type="text"
                            placeholder="Price"
                            className="mb-2"
                            value={classType?.price}
                        />
                    </Row>
                    <Row className="g-2">
                        <Input
                            type="textarea"
                            placeholder="Description"
                            className="mb-2"
                            rows="8"
                            value={classType?.description}
                        />
                    </Row>
                </form>
            )}
        </div>
    );
};

export default connect(
    (state) => ({
        classType: state.classes?.classDetails,
    }),
    {
        fetchClassDetails: actions.fetchClassDetails,
    }
)(ClassTypeSetup);
