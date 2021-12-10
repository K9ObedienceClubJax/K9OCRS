import React from "react";
import { NavLink } from "reactstrap";
import { Link } from "react-router-dom";

export default function Sections({
  section,
  day,
  time,
  start,
  duration,
  instructor,
  seats,
}) {
  return (
    <>
      <td>
        <NavLink tag={Link} className="text-dark" to="/confirm">
          {section}
        </NavLink>
      </td>
      <td>{day}</td>
      <td>{time}</td>
      <td>{start}</td>
      <td>{duration}</td>
      <td>{instructor}</td>
      <td>{seats}</td>
    </>
  );
}
