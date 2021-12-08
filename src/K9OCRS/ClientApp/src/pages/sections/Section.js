import React from "react";

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
      <td>{section}</td>
      <td>{day}</td>
      <td>{time}</td>
      <td>{start}</td>
      <td>{duration}</td>
      <td>{instructor}</td>
      <td>{seats}</td>
    </>
  );
}
