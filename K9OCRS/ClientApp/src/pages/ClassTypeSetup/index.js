import React from 'react';
import { Container } from 'reactstrap';

const ClassTypeSetup = () => {
  return (
    <Container>
      <h1>Class Type Setup</h1>
      <form className="d-flex flex-column">
        <input type="text" placeholder="Hero Image Url" className="mb-2" />
        <input type="text" placeholder="Title" className="mb-2" />
        <input type="text" placeholder="Description" className="mb-2" />
        <input type="text" placeholder="Session Length" className="mb-2" />
        <input type="text" placeholder="Price" className="mb-2" />
        <button type="cancel">Cancel</button>
        <button type="submit">Submit</button>
      </form>
    </Container>
  );
};

export default ClassTypeSetup;
