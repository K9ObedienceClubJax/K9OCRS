import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DogData = (props) => {

    const {id} = props;

    const [dogInfo, setDogInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        async function getTest() {
            if (id) {
                try {
                    const res = await axios.get(`/api/Dogs/ ${id}`);
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
        <div className='ps-3'>
            <p>Dog: {dogInfo.name}</p>
            <p>Breed: {dogInfo.breed}</p>
            <p>Date of Birth: {dogInfo.dateOfBirth}</p>
            <p>Age:</p>
        </div>
        <h4>Vaccination Record</h4>
        <div className='ps-3'>
            <p>Status:</p>
            <p>Expiration Date:</p>
            <p>Reviewed By:</p>
            <p>Reviewed</p>
        </div>
        </>
    )

};

export default DogData;