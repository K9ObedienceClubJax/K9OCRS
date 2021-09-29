import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from './modules/actions';
import selectors from './modules/selectors';

const ExamplePage = props => {
  const { init, result } = props;

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <h1>Hello World! From Demo</h1>
      <h2>This is an example page with some documentation.</h2>
      <p>This page will be removed soon and the route will be replaced by the dashboard page.</p>
      <hr />
      <article>
        <h3>Useful videos</h3>
        <ul>
          <li>
            <a href="https://www.youtube.com/watch?v=GU-2T7k9NfI&ab_channel=Academind" target="_blank" rel="noopener noreferrer">What is webpack?</a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=CVpUuw9XSjY&ab_channel=DevEd" target="_blank" rel="noopener noreferrer">React Redux Tutorial</a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=eUMbH6X_Adc&ab_channel=techsith" target="_blank" rel="noopener noreferrer">Redux Saga Tutorial</a>
          </li>
        </ul>
      </article>
      <article>
        <h3>Useful Routes</h3>
        <ul>
          <li>
            <a href="/swagger">/swagger</a>: Route for the auto-generated swagger documentation. As we build the API, this page will get updated
            with information for it.
          </li>
        </ul>
      </article>
      <article>
        <h3>Folder Structure</h3>
        <ul>
          <li>
            <p>
              <strong>/app:</strong> This is where the global layout, reducers, sagas, actions, routing and other all-encompasing things live.
            </p>
          </li>
          <li>
            <p>
              <strong>/pages:</strong> This is where the pages live, along with their own reducers, sagas and actions. They can also contain page-specific components.
            </p>
          </li>
          <li>
            <p>
              <strong>/components:</strong> This is where shared components live. A Loader component is a good example because it could be used on many different pages.
            </p>
          </li>
          <li>
            <p>
              <strong>/assets:</strong> Here we can put any local assets such as image files. Might not be used
            </p>
          </li>
          <li>
            <p>
              <strong>/util:</strong> Files containing utility methods, constants or other useful files such as the bootstrap theme override files.
            </p>
          </li>
          <li>
            <p>
              <strong>/webpack:</strong> Configuration files for webpack. Used to build our code. The work here is done.
            </p>
          </li>
        </ul>
      </article>
      <article>
        <h3>"modules" folders</h3>
        <p>
          You'll find these folders under <strong>/app</strong> and under each page directory that requires them.
          These folders typically contain 3 files: actions.js, sagas.js and reducers.js. <br/>
          <ul>
            <li>
              <p>
                <strong>actions.js</strong> contains action definitions. Actions are "dispatched" to modify the redux state using reducers or trigger sagas.
              </p>
            </li>
            <li>
              <p>
                <strong>reducer.js</strong> specifies the way that actions modify state, and also set the initial state for a "section" of the redux state.
              </p>
            </li>
            <li>
              <p>
                <strong>sagas.js</strong> contains generator functions that are triggered by actions. You'll generally use these for api calls and to interact
                the redux state.
              </p>
            </li>
          </ul>
        </p>
      </article>
    </div>
  );
};

export default connect(state => ({
  result: selectors.selectExampleResult(state),
}), {
  init: actions.initialize,
})(ExamplePage);