import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Button, Input, Spinner } from 'reactstrap';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import PageHeader from '../../../shared/components/PageHeader';
import { Link } from 'react-router-dom';

const ClassTypeSetup = () => {
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [classType, setClassType] = useState([]);

    const { classTypeId } = useParams();

    useEffect(() => {
        async function getTest() {
            try {
                const res = await classTypesClient.getClassTypeByID(
                    classTypeId
                );
                setClassType(res?.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setAlerts([
                    {
                        color: 'danger',
                        message:
                            "We're having issues retrieving the requested class type.",
                    },
                ]);
            }
        }
        getTest();
    }, [classTypeId]);

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

export default ClassTypeSetup;
