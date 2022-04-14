import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import selectors from '../../../shared/modules/selectors';
import PageHeader from '../../../shared/components/PageHeader';
import { Alert, Button, Spinner } from 'reactstrap';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import PageBody from '../../../shared/components/PageBody';

const Confirm = (props) => {
    const { sectionId } = useParams();
    const [sectionDetail, setSectionDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    //const { currentUser } = props;

    useEffect(() => {
        async function getTest() {
            if (sectionId) {
                try {
                    const res = await axios.get(`/api/ClassSections/ ${sectionId}`);
                    setSectionDetail(res?.data);
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
    }, [sectionId]);

    return (
        <div className="container">
            <PageHeader
                title={sectionDetail?.classType?.title ?? 'Confirm'}
                alerts={alerts}
                breadCrumbItems={[
                    { label: 'Class Catalog', path: '/' },
                    {
                        label: sectionDetail?.classType?.title ?? 'Class',
                        path: `/Classes/${sectionDetail?.classType?.id}`,
                    },
                    { label: 'Application', active: true },
                ]}
                setAlerts={setAlerts}
            >
                <Button color="secondary" outline>
                    Cancel
                </Button>
                <Button color="primary">Submit Application</Button>
            </PageHeader>
            <PageBody>
                <Alert color="info">
                    <h3>Review your application</h3>
                    <span>
                        Please review the class' details, then select the dog that you want to
                        register for this class section and verify that the dog's information is
                        comlete and up to date.
                    </span>
                </Alert>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <h4>Class Instructor</h4>
                        <ProfileBadge
                            className="d-inline-flex"
                            {...sectionDetail?.instructor}
                            imageUrl={sectionDetail?.instructor?.profilePictureUrl}
                        />
                        <h4>Class Schedule</h4>
                        <i>Note that these dates and times are subject to change</i>
                        <ol>
                            {sectionDetail?.meetings?.map((meeting) => {
                                // Use the momentjs package to format dates
                                var startDate = moment(meeting.startDate);
                                var endDate = moment(meeting.endDate);

                                // Create the format string
                                var endTimeFormat = endDate.minutes() > 0 ? 'h:mma' : 'ha';
                                var startTimeFormat = startDate.minutes() > 0 ? 'h:mm' : 'h';
                                // Display start time's am or pm only if it is different from end time's
                                var startDateAmPm =
                                    startDate.format('A') !== endDate.format('A') ? 'a' : '';
                                var formatString = `dddd, MMMM Do, YYYY [from] ${startTimeFormat}${startDateAmPm}-`;

                                // Format the dates using the format strings
                                var formattedStartDateAndTime = startDate.format(formatString);
                                var formattedEndTime = endDate.format(endTimeFormat);

                                return (
                                    <li
                                        key={meeting.id}
                                    >{`${formattedStartDateAndTime}${formattedEndTime}`}</li>
                                );
                            })}
                        </ol>
                        <h4>Class Requirements</h4>
                        <p>{sectionDetail?.classType?.requirements}</p>
                    </>
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {}
)(Confirm);
