import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as classTypesClient from 'Util/apiClients/classTypes';
import { Container, Spinner, Row, Col, Button } from 'reactstrap';
import { isAdmin as verifyIsAdmin } from 'Util/accessEvaluator';
import Table from '../../../shared/components/Table';
import sectionColumns from './components/sectionColumns';
import PageHeader from '../../../shared/components/PageHeader';
import './components/style.scss';
import PageBody from '../../../shared/components/PageBody';

const Classes = (props) => {
    const { isAdmin } = props;

    const { classTypeId } = useParams();
    const [classDetail, setClassDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        async function getTest() {
            if (classTypeId) {
                try {
                    const res = await classTypesClient.getClassTypeByID(classTypeId);
                    setClassDetail(res?.data);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    setAlerts([
                        {
                            color: 'danger',
                            message: "We're having issues getting the details for this class",
                        },
                    ]);
                }
            }
        }
        getTest();
    }, [classTypeId]);

    const photoArr = classDetail.photos;

    return (
        <>
            <PageHeader
                title={classDetail.title ?? 'Class Details'}
                alerts={alerts}
                breadCrumbItems={[
                    { label: 'Class Catalog', path: '/' },
                    { label: classDetail.title ?? 'Class Details', active: true },
                ]}
                setAlerts={setAlerts}
            >
                {!isAdmin ? null : (
                    <Button
                        tag="a"
                        href={`/Manage/Classes/Types/${classTypeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Edit Class Type
                    </Button>
                )}
            </PageHeader>
            <PageBody>
                {loading ? <Spinner /> : null}
                {!loading && (
                    <Container className="px-sm-5 container-sm" fluid>
                        <img
                            className="pb-4 heroImg"
                            alt={`The ${classDetail.title} class`}
                            src={classDetail.imageUrl}
                        />
                        <h5>Description</h5>
                        <p>{classDetail.description}</p>
                        <h5>Requirements</h5>
                        {classDetail.requirements ? (
                            <p>{classDetail.requirements}</p>
                        ) : (
                            <p>This class has no requirements</p>
                        )}
                        <h5>Sections</h5>
                        {classDetail.sections?.length > 0 ? (
                            <div>
                                Choose one of the sections below to start the application process!
                            </div>
                        ) : (
                            <div>
                                There are currently no sections available for this course. Please
                                check back soon!
                            </div>
                        )}

                        {!loading && classDetail.sections?.length > 0 ? (
                            <Table
                                columns={sectionColumns}
                                data={classDetail.sections}
                                pageSize={12}
                                footnotes={['* This is the usual meeting time, but it may vary']}
                                withPagination
                            />
                        ) : null}
                        <Row className="my-4">
                            {photoArr?.length > 0 ? (
                                photoArr.map((sectImg) => (
                                    <Col
                                        key={sectImg.id}
                                        className="mb-4"
                                        sm="12"
                                        md="6"
                                        lg="4"
                                        xl="3"
                                    >
                                        <img
                                            className="classThumbnails"
                                            alt={`The ${sectImg.fileName} class`}
                                            src={sectImg.imageUrl}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <></>
                            )}
                        </Row>
                    </Container>
                )}
            </PageBody>
        </>
    );
};

export default connect(
    (state) => ({
        isAdmin: verifyIsAdmin(state?.shared?.currentUser),
    }),
    {}
)(Classes);
