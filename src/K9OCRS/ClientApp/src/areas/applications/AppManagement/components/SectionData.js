import React, { useEffect, useState } from 'react';
import axios from 'axios';


const SectionData = (props) => {
    const {id} = props;

    const [sectionData, setSectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);


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
        <h4>Class Details</h4>
        <div className='ps-3'>
            <p>Section:&nbsp;&nbsp;{sectionData?.id} </p>
            <p>Instructor:&nbsp;&nbsp;{sectionData?.instructor.firstName} {sectionData?.instructor.lastName}</p>
            <p>Type: &nbsp;&nbsp;{sectionData?.classType.title}</p>
            <p>Price:&nbsp;&nbsp;${sectionData?.classType.price}</p>
            <p>Requirements:&nbsp;&nbsp;{sectionData?.classType.requirements}</p>
        </div>
        </>
    )

};

export default SectionData;