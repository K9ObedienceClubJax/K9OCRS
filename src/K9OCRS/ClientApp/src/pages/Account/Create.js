import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Input } from 'reactstrap';
import createAccount from '../../util/apiClients/userAccounts';
import { useHistory } from 'react-router-dom';
import * as actions from '../../areas/accounts/modules/actions';
import selectors from '../../shared/modules/selectors';

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

function ValidateConfirm(e, password) {
  //Validate passwords are the same
  if (password === e.value) {
    e.setAttribute('isvalid', 'true');
    e.setCustomValidity('');
  } else {
    e.setCustomValidity('Password does not match');
    e.reportValidity();
  }
}

const CreateAccount = (props) => {
  const { currentUser = null, loginAction } = props;

  useEffect(() => {
    if (currentUser !== null) {
      history.push('/');
    }
  }, [currentUser]); // eslint-disable-line

  let history = useHistory();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [result, setResult] = useState('');

  async function handleSubmit(first, last, email, password, confirm, history) {
    try {
      const response = await createAccount({
        first,
        last,
        email,
        password,
        confirm,
      });
      setResult(response);
      loginAction({ email, password });
      history.push('/');
    } catch (err) {
      setResult(err.response);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(first, last, email, password, confirm, history);
      }}
    >
      <h1 className='d-flex justify-content-center mt-4 font-weight-bold'>
        Create an Account
      </h1>

      <Row className='mt-3'>
        <Col lg='2' className='offset-lg-4'>
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

        <Col lg='2'>
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
        <Col lg='4' className='mx-auto'>
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

      <Row>
        <Col lg='4' className='mx-auto'>
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

      <Row>
        <Col lg='4' className='mx-auto'>
          <div className='input-group mb-3'>
            <Input
              type='password'
              className='form-control'
              placeholder='Confirm Password'
              htmlFor='Confirm'
              name='confirm'
              value={confirm}
              onChange={(e) => {
                ValidateConfirm(e.target, password);
                setConfirm(e.target.value);
              }}
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg='4' className='mx-auto'>
          <p className='text-danger d-flex justify-content-center mb-3'>
            {result?.data}
          </p>
          <Button
            className='btn btn-secondary btn-lg mx-auto d-flex justify-content-center'
            type='submit'
          >
            Create
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default connect(
  (state) => ({
    currentUser: selectors.selectCurrentUser(state),
  }),
  { loginAction: actions.login }
)(CreateAccount);
