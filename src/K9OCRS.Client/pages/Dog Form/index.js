import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from './modules/actions';
import selectors from './modules/selectors';

const DogForm = props => {
  const { init, result } = props;

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <h1>Dog Form</h1>
      <form action="#" method="POST">
          <label for="dogName">Name:</label>
          <input id="dogName" name="dogName" type="text" required></input>
          <label for="dogAge">Age:</label>
          <input id="dogAge" name="dogAge" type="number"></input>
          <label for="dogBreed">Dog breed:</label>
          <input id="dogBreed" name="dogBreed" type="text" required></input>

      </form>
    </div>
  );
};

export default connect(state => ({
  result: selectors.selectExampleResult(state),
}), {
  init: actions.initialize,
})(ExamplePage);