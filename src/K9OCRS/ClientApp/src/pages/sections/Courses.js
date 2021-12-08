import React, { useState } from "react";
import { boostrap } from "bootstrap";
import data from "./data.json";
import CourseDisplay from "./CourseDisplay";
import Search from "./Search";

const Courses = () => {
  let [query, setQuery] = useState("");

  const filteredClasses = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="container">
      <h3>Available Classes</h3>
      <div>
        <Search query={query} onQueryChange={(myquery) => setQuery(myquery)} />
        {filteredClasses.map((props) => (
          <CourseDisplay key={data.id} {...props} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
