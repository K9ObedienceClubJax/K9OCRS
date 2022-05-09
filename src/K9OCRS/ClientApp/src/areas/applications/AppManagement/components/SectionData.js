import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import axios from 'axios';


const SectionData = (props) => {
    const {id} = props;

    const [sectionData, setSectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]); // eslint-disable-line


    useEffect(() => {
        async function getTest() {
            if (id) {
                try {
                    const res = await axios.get(`/api/ClassSections/ ${id}`);
                    setSectionData(res?.data);
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
        {loading && <Spinner />}
        <h4>Class Details</h4>
        <div className='ps-3'>
            <p className='my-1'><b>Section:</b>&nbsp;&nbsp;{sectionData?.id} </p>
            <p className='my-1'><b>Instructor:</b>&nbsp;&nbsp;{sectionData?.instructor?.firstName} {sectionData?.instructor?.lastName}</p>
            <p className='my-1'><b>Type:</b> &nbsp;&nbsp;{sectionData?.classType?.title}</p>
            <p className='my-1'><b>Price:</b>&nbsp;&nbsp;${sectionData?.classType?.price}</p>
            <p className='my-1'><b>Requirements:</b>&nbsp;&nbsp;{sectionData?.classType?.requirements}</p>
        </div>
        </>
    )

};

export default SectionData;