import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import selectors from "../../../shared/modules/selectors";


const Confirm = props => {

  const { sectionId } = useParams();
  const [sectionDetail, setSectionDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const { currentUser } = props;

  useEffect(() => {
      async function getTest() {
        if (sectionId) {
          try {
            const res = await axios.get(`/api/ClassSections/ ${sectionId}`);
            setSectionDetail(res?.data);
            setLoading(false);
          } catch(err) {
            setLoading(false);
            setAlerts([{ color: 'danger', message: 'We\'re having issues getting the details for this class' }]);
          }
        }
      }
      getTest();
    }, [sectionId]);

    let x = sectionDetail?.rosterCapacity;
    let y = sectionDetail?.rosterActual;
    let z = x-y;
    
  return (
    <div className="container">
      <h3>Thank you for choosing the following class:</h3>
      <div className="mt-3 mb-3">
        <div className="card">
          <div className="card-header">
            <h3>{sectionDetail?.classType?.title}</h3>
          </div>
          <div className="card-body">
          {sectionDetail?.classType?.description}
          </div>
          <div className="card-footer">
            <span className="text-center font-weight-bold">
              Section: {sectionDetail?.id} | Day: Monday | Time: 6PM | Start: {sectionDetail?.startDate} |
              Duration: 7 weeks | Instructor: {sectionDetail?.instructor?.firstName} {sectionDetail?.instructor?.lastName} | Available Seats: {z}
            </span>
          </div>
        </div>
      </div>
      <h4>Please confirm your information:</h4>
      <ul>
        <li>
          <span className="font-weight-bold">Student Name: </span>{currentUser.firstName} {currentUser.lastName}
        </li>
        <li>
          <span className="font-weight-bold">Email:</span> {currentUser.email}
        </li>
      </ul>
      <p>Or update below:</p>
      <form className="mt-3">
        <label className="form-control-label">
          <span className="font-weight-bold">First Name: </span></label>
        <input
          className="form-control"
          type="text"
          id="firstName"
          placeholder={currentUser.firstName}
        />
        <label className="form-control-label">
          <span className="font-weight-bold">Last Name: </span></label>
        <input
          className="form-control"
          type="text"
          id="lastName"
          placeholder={currentUser.lastName}
        />
        <label className="form-control-label">
          <span className="font-weight-bold">Email:</span></label>
        <input
          className="form-control"
          type="email"
          id="email"
          placeholder={currentUser.email}
        />
      </form>
    </div>
  );
};

export default connect(state => ({
  currentUser: selectors.selectCurrentUser(state),
}), {
})(Confirm);
