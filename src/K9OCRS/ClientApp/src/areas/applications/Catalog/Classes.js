import React from "react";
import { useLocation } from "react-router-dom";

const Classes = props => {
    const location = useLocation();
    const title = location.state.title;
    const description = location.state.description;
    const requirements = location.state.requirements;

    return (
        <>
        <h2>{title} </h2>
        <p>Class Catalog / {title}</p>
        <div className="container">
        <h5>Description</h5>
        <p>{description}</p>
        <h5>Requirements</h5>
        {(typeof {requirements} !== 'undefined') ? <p>{requirements}</p> : <p>This class has no requirements</p>}
        </div>
        </>
    )
};

export default Classes;