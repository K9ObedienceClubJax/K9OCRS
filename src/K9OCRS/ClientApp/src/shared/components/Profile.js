import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import { connect } from 'react-redux';
import selectors from '../../shared/modules/selectors';
import * as accountsApi from '../../util/apiClients/userAccounts';

function ValidateEmail(e) {
  //Validate email
  let regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/i;
  if (regex.test(e.value)) {
    e.setAttribute('isvalid', 'true');
    e.setCustomValidity('');
  } else {
    e.setCustomValidity('Not a valid email format.');
    e.reportValidity();
  }
}

function ValidatePassword(e) {
  //Validate password requirements
  let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/i;
  if (regex.test(e.value)) {
    e.setAttribute('isvalid', 'true');
    e.setCustomValidity('');
  } else {
    e.setCustomValidity(
      'Password requires at least 8 characters, should contain at least one upper case, lower case, and a digit'
    );
    e.reportValidity();
  }
}

function handleSubmit(defaultMode, setAlerts, userId, first, last, email) {
  if (defaultMode) {
    accountsApi.changeInfo(userId, first, last, email);
    setAlerts([
      {
        color: 'success',
        message: 'Your changes have been saved!',
      },
    ]);
  }
}

const Profile = (props) => {
  const { currentUser = null, mode = null } = props;
  const [alerts, setAlerts] = useState([]);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  var defaultMode = false;
  var createMode = false;
  var inspectMode = false;

  if (mode == 'create' && currentUser.userRoleID == 1) {
    createMode = true;
  } else if (mode == 'inspect' && currentUser.userRoleID == 1) {
    inspectMode = true;
  } else {
    defaultMode = true;
  }

  useEffect(() => {
    setFirst(currentUser.firstName);
    setLast(currentUser.lastName);
    setEmail(currentUser.email);
  }, []);

  return (
    <form
      id='myForm'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(
          defaultMode,
          setAlerts,
          currentUser.id,
          first,
          last,
          email
        );
        setAlerts([
          {
            color: 'success',
            message: 'Your changes have been saved!',
          },
        ]);
      }}
    >
      <Col lg={{ size: 10, offset: 1 }}>
        <img src='' />
        <Row className='mt-3'>
          <Col lg={{ size: 3, offset: 3 }}>
            <div className='input-group mb-3'>
              <Input
                type='text'
                className='form-control'
                placeholder='First Name'
                htmlFor='First'
                name='first'
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                required
              />
            </div>
          </Col>

          <Col lg='3'>
            <div className='input-group mb-3'>
              <Input
                type='text'
                className='form-control'
                placeholder='Last Name'
                htmlFor='Last'
                name='last'
                value={last}
                onChange={(e) => setLast(e.target.value)}
                required
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg='6' className='mx-auto'>
            <div className='input-group mb-3'>
              <Input
                type='email'
                className='form-control'
                placeholder='Email Address'
                htmlFor='Email'
                name='email'
                value={email}
                onChange={(e) => {
                  ValidateEmail(e.target);
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
          </Col>
        </Row>
        {createMode === true && (
          <Row>
            <Col lg='6' className='mx-auto'>
              <div className='input-group mb-3'>
                <Input
                  type='password'
                  className='form-control'
                  placeholder='Password'
                  htmlFor='Password'
                  name='password'
                  value={password}
                  onChange={(e) => {
                    ValidatePassword(e.target);
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
            </Col>
          </Row>
        )}

        {defaultMode === true && (
          <Row className='text-center'>
            <a href='/Account/PasswordReset'>Change Password</a>
          </Row>
        )}

        {(inspectMode === true || createMode === true) && (
          <div className='mx-auto text-center mt-3'>
            <input
              type='radio'
              className='btn-check'
              name='options'
              id='option1'
              autocomplete='off'
            />
            <label class='btn btn-secondary' for='option1'>
              Non-Member
            </label>

            <input
              type='radio'
              className='btn-check'
              name='options'
              id='option2'
              autocomplete='off'
            />
            <label class='btn btn-secondary' for='option2'>
              Member
            </label>

            <input
              type='radio'
              className='btn-check'
              name='options'
              id='option3'
              autocomplete='off'
            />
            <label class='btn btn-secondary' for='option3'>
              Instructor
            </label>

            <input
              type='radio'
              className='btn-check'
              name='options'
              id='option4'
              autocomplete='off'
            />
            <label class='btn btn-secondary' for='option4'>
              Admin
            </label>
          </div>
        )}
      </Col>
    </form>
  );
};

export default connect((state) => ({
  currentUser: selectors.selectCurrentUser(state),
}))(Profile);
