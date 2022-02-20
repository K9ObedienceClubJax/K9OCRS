import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as classTypesClient from '../../../util/apiClients/classTypes';
import { CardImg } from "reactstrap";

const Classes = props => {
    const location = useLocation();
    const id = location.state.id;
    const [classDetail, setClassDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    // const description = location.state.description;
    // const requirements = location.state.requirements;

    useEffect(() => {
        async function getTest() {
          try {
            const res = await classTypesClient.getClassTypeByID(id);
            setClassDetail(res?.data);
            setLoading(false);
          } catch(err) {
            setLoading(false);
            setAlerts([{ color: 'danger', message: 'We\'re having issues getting the details for this class' }]);
          }
        }
        getTest();
      }, [id]);

    return (
        <>
        <h2>{classDetail.title} </h2>
        
        <p>Class Catalog / {classDetail.title}</p>
        <div className="container">
        <CardImg
          alt={`Image for the ${classDetail.title} class`}
          src={classDetail.imageUrl}
          top
        />
        <h5>Description</h5>
        <p>{classDetail.description}</p>
        <h5>Requirements</h5>
        {classDetail.requirements ? <p>{classDetail.requirements}</p> : <p>This class has no requirements</p>}
        
        </div>
        </>
    )
};

export default Classes;