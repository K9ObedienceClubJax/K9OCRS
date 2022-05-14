import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { Spinner } from 'reactstrap';

const DogData = (props) => {
    const { id } = props;

    const [dogInfo, setDogInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]); // eslint-disable-line

    useEffect(() => {
        async function getTest() {
            if (id) {
                try {
                    const res = await axios.get(`/api/Dogs/${id}`);
                    setDogInfo(res?.data);
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
    }, [id]);

    return (
        <>
            <h4>Dog Details</h4>
            {loading ? (
                <Spinner />
            ) : (
                <div className="ps-3">
                    <p className="my-1">
                        <b>Dog:</b> {dogInfo.name}
                    </p>
                    <p className="my-1">
                        <b>Breed:</b> {dogInfo.breed}
                    </p>
                    <p className="my-1">
                        <b>Date of Birth:</b>{' '}
                        {dogInfo?.dateOfBirth
                            ? moment(dogInfo?.dateOfBirth).format('MMM d, YYYY')
                            : ''}
                    </p>
                    <p className="my-1">
                        <b>Age:</b>{' '}
                        {moment().diff(dogInfo?.dateOfBirth, 'months') < 12
                            ? moment().diff(dogInfo?.dateOfBirth, 'months') + ' months'
                            : moment().diff(dogInfo?.dateOfBirth, 'years') +
                              ' year(s), ' +
                              (moment().diff(dogInfo?.dateOfBirth, 'months') % 12) +
                              ' months'}
                    </p>
                </div>
            )}
            <h4>Vaccination Record</h4>
            {loading ? (
                <Spinner />
            ) : (
                <div className="ps-3">
                    <p className="my-1">
                        <b>Status:</b>
                    </p>
                    <p className="my-1">
                        <b>Expiration Date:</b>
                    </p>
                    <p className="my-1">
                        <b>Reviewed By:</b>
                    </p>
                    <p className="my-1">
                        <b>Reviewed</b>
                    </p>
                </div>
            )}
        </>
    );
};

export default DogData;
