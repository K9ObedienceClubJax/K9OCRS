import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import selectors from "../../../shared/modules/selectors";
import PageHeader from '../../../shared/components/PageHeader';
import { Alert, Button } from 'reactstrap';
import Avatar from '../../../shared/components/Avatar';


const Confirm = props => {

  const { sectionId } = useParams();
  const [sectionDetail, setSectionDetail] = useState([]);
  // TODO: remove the eslint comments from the lines below and actually use the loading and alerts variables.
  const [loading, setLoading] = useState(true); // eslint-disable-line
  const [alerts, setAlerts] = useState([]); // eslint-disable-line
  //const { currentUser } = props;

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

    
  return (
    <div className="container">
      <PageHeader
          title={sectionDetail?.classType?.title ?? 'Confirm'}
          alerts={alerts}
          breadCrumbItems={[
            { label: 'Class Catalog', path: '/' },
            { label: sectionDetail?.classType?.title ?? 'Confirm', active: true },
          ]}
          setAlerts={setAlerts}
        >
      <Button color='light'>
          Cancel
        </Button>
      <Button color='primary'>
          Submit Application
        </Button>
        </PageHeader>
        <Alert color="primary"><h3>Review your application</h3>
          <span>Please review the class' details, then select the dog that you want to register for this class section and verify that the dog's information is comlete and up to date.</span>
        </Alert>
        <h4>Class Instructor</h4>
        <p className="align-middle"><Avatar imageUrl={sectionDetail?.instructor?.profilePictureUrl} /> {sectionDetail?.instructor?.firstName} {sectionDetail?.instructor?.lastName}</p>
        <h4>Class Schedule</h4>
        <i>Note that these dates and times are subject to change</i>
        <ol>
          {sectionDetail?.meetings?.map((meeting) => (
            <li key={meeting.id}>{meeting.startDate}</li>
          ))}
        </ol>
        <h4>Class Requirements</h4>
        <p>{sectionDetail?.classType?.requirements}</p>
    </div>
  );
};

export default connect(state => ({
  currentUser: selectors.selectCurrentUser(state),
}), {
})(Confirm);
