import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import { connect } from 'react-redux';
import selectors from '../../shared/modules/selectors';
import * as accountsApi from '../../util/apiClients/userAccounts';
import axios from 'axios';

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

async function getUserData(
  id,
  setFirst,
  setLast,
  setEmail,
  setRole,
  setPicture
) {
  //Get id from url
  // const queryParams = new URLSearchParams(window.location.search);
  // const id = queryParams.get('id');
  //API call to get user data
  const inspectedUser = await accountsApi.getUser(id);
  //Set user data
  // setUserID(inspectedUser.id);
  setFirst(inspectedUser.firstName);
  setLast(inspectedUser.lastName);
  setEmail(inspectedUser.email);
  setRole(inspectedUser.userRoleID);
  setPicture(inspectedUser.profilePictureFilename);
  //Use to role id to select the radio button
  const radio = document.getElementById('option' + inspectedUser.userRoleID);
  radio.checked = true;
}

function sendPasswordEmail(email, setAlerts) {
  accountsApi.forgotPassword(email);
  setAlerts([
    {
      color: 'info',
      message: 'Email for password reset has been sent.',
    },
  ]);
}

function handleSubmit(
  defaultMode,
  createMode,
  inspectMode,
  setAlerts,
  userId,
  first,
  last,
  email,
  password,
  role,
  picture
) {
  if (defaultMode) {
    accountsApi.changeInfo(userId, first, last, email);
    setAlerts([
      {
        color: 'success',
        message: 'Your changes have been saved!',
      },
    ]);
  } else if (createMode) {
    accountsApi.createUser(email, first, last, password, role);
    setAlerts([
      {
        color: 'success',
        message: 'User created!',
      },
    ]);
  } else if (inspectMode) {
    accountsApi.changeInfo(userId, first, last, email, role, picture);
    setAlerts([
      {
        color: 'success',
        message: 'Your changes have been saved!',
      },
    ]);
  }
}

const Profile = (props) => {
  const { currentUser = null, mode = null, paramsId = null } = props;
  const setAlerts = props.setAlerts;
  const [userID, setUserID] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [picture, setPicture] = useState('');

  var defaultMode = false;
  var createMode = false;
  var inspectMode = false;

  if (mode === 'create' && currentUser.userRoleID === 1) {
    createMode = true;
  } else if (mode === 'inspect' && currentUser.userRoleID === 1) {
    inspectMode = true;
  } else {
    defaultMode = true;
  }

  useEffect(() => {
    if (defaultMode) {
      setUserID(currentUser.id);
      setFirst(currentUser.firstName);
      setLast(currentUser.lastName);
      setEmail(currentUser.email);
    }
    if (inspectMode) {
      setUserID(paramsId);
      getUserData(paramsId, setFirst, setLast, setEmail, setRole, setPicture);
    }
  }, []);

  return (
    <form
      id='profileForm'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(
          defaultMode,
          createMode,
          inspectMode,
          setAlerts,
          userID,
          first,
          last,
          email,
          password,
          role,
          picture
        );
      }}
    >
      <Col lg={{ size: 10, offset: 1 }}>
        <Row className='mt-3'>
          <Col lg={{ size: 3, offset: 3 }}>
            <div className='input-group mb-3'>
              <Input
                type='text'
                autoComplete='off'
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
                autoComplete='off'
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
                autoComplete='off'
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
        {inspectMode === true && (
          <Row className='text-center'>
            <a
              style={{
                cursor: 'pointer',
              }}
              className='link-info'
              onClick={() => sendPasswordEmail(email, setAlerts)}
            >
              Send user password reset email
            </a>
          </Row>
        )}
        {createMode === true && (
          <Row>
            <Col lg='6' className='mx-auto'>
              <div className='input-group mb-3'>
                <Input
                  type='password'
                  autoComplete='new-password'
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
          <div className=' mx-auto text-center mt-3'>
            <div className='btn-group'>
              <input
                type='radio'
                className='btn-check'
                name='role'
                value={4}
                id='option4'
                onChange={(e) => setRole(e.currentTarget.value)}
              />
              <label className='btn btn-outline-secondary' htmlFor='option4'>
                Non-Member
              </label>

              <input
                type='radio'
                className='btn-check'
                name='role'
                value={3}
                id='option3'
                onChange={(e) => setRole(e.currentTarget.value)}
              />
              <label className='btn btn-outline-secondary' htmlFor='option3'>
                Member
              </label>

              <input
                type='radio'
                className='btn-check'
                name='role'
                value={2}
                id='option2'
                onChange={(e) => setRole(e.currentTarget.value)}
              />
              <label className='btn btn-outline-secondary' htmlFor='option2'>
                Instructor
              </label>

              <input
                type='radio'
                className='btn-check'
                name='role'
                value={1}
                id='option1'
                onChange={(e) => setRole(e.currentTarget.value)}
              />
              <label className='btn btn-outline-secondary' htmlFor='option1'>
                Admin
              </label>
            </div>
          </div>
        )}
      </Col>
    </form>
  );
};

export default connect((state) => ({
  currentUser: selectors.selectCurrentUser(state),
}))(Profile);
