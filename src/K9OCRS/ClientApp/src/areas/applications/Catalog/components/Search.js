import React from "react";

const Search = ({ query, onQueryChange }) => {
  return (
    <div className="py-3">
      <label htmlFor="query" className="sr-only" />
      <input
        className="form-control"
        type="text"
        name="query"
        id="query"
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
        }}
        placeholder="Search"
      />
    </div>
  );
};

export default Search;
