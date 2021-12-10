import React from "react";
import SectionDisplay from "./SectionDisplay";

const CourseDisplay = ({
  name = "untitled",
  description = "untitled",
  cost = "untilted",
  sessions = [],
}) => {
  return (
    <>
      <h3 className="bg-light text-dark p-2">{name}</h3>
      <div>{description}</div>
      <div className="pb-3">Cost: {cost}</div>
      <table className="table table-hover table-sm">
        <thead className="text-secondary">
          <tr>
            <th>Session</th>
            <th>Day</th>
            <th>Time</th>
            <th>Start</th>
            <th>Duration</th>
            <th>Instructor</th>
            <th>Seats</th>
          </tr>
        </thead>
        <SectionDisplay list={sessions} />
      </table>
      <br />
    </>
  );
};

export default CourseDisplay;
