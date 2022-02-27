import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as classTypesClient from '../../../util/apiClients/classTypes';
import { Container, Spinner, Row, Col } from "reactstrap";
import Table from "../../../shared/components/Table";
import sectionColumns from './components/sectionColumns';
import PageHeader from '../../../shared/components/PageHeader';
import './components/style.scss';

const Classes = props => {
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
            } catch(err) {
              setLoading(false);
              setAlerts([{ color: 'danger', message: 'We\'re having issues getting the details for this class' }]);
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
        />
        
        <p>Class Catalog / {classDetail.title}</p>
        <Container className="px-sm-5 container-sm" fluid>
        <img
          className="pb-4 heroImg"
          alt={`The ${classDetail.title} class`}
          src={classDetail.imageUrl}
          top
        />
        <h5>Description</h5>
        <p>{classDetail.description}</p>
        <h5>Requirements</h5>
        {classDetail.requirements ? <p>{classDetail.requirements}</p> : <p>This class has no requirements</p>}
        {loading ? <Spinner /> : <Table 
            columns={sectionColumns} 
            data={classDetail.sections}
            pageSize={12}
            footnotes={['* This is the usual meeting time, but it may vary']}
            withPagination 
        /> }
        <Row className="my-4">
        {
          photoArr?.length > 0 ? photoArr.map(sectImg => (
          <Col className="mb-4" sm="12" md="6" lg="4" xl="3">
          <img
              key={sectImg.id}
              className="classThumbnails"
              alt={`The ${sectImg.fileName} class`}
              src={sectImg.imageUrl}
              top
            />
          </Col>
          )) : <></>
            }
            </Row>
        </Container>
        </>
    )
};

export default Classes;