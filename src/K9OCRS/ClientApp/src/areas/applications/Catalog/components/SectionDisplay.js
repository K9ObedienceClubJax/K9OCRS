import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';


const SectionDisplay = (props) => {
    return (
        <>
            <tr>
        <td>{props.startTime}</td>
        <td>{props.endTime}</td>
        <td>{props.instructor}</td>
        <td>{props.rosterCapacity}</td>
        <td>{props.rosterActual}</td>
        <td>
        <NavLink tag={Link} className="text-dark" to="/confirm">
          Enroll
        </NavLink>
      </td>
            </tr>
        </>)
};

export default SectionDisplay;
