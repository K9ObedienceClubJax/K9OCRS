import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import * as actions from '../../areas/accounts/modules/actions';
import selectors from '../../shared/modules/selectors';
import PageHeader from '../../shared/components/PageHeader';

const Login = (props) => {
    const { currentUser = null, loginAction } = props;

    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (currentUser !== null) {
            navigate('/');
        }
    }, [currentUser]); // eslint-disable-line

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                loginAction({ email, password, setAlerts });
            }}
        >
            <PageHeader title="" alerts={alerts} setAlerts={setAlerts} />
            <h1 className="mt-4 mb-4 d-flex justify-content-center ">Login</h1>
            <Row className="mt-3">
                <Col lg="4" className="mx-auto">
                    <div className="input-group mb-3">
                        <Input
                            type="text"
                            className="form-control"
                            placeholder="Email Address"
                            htmlFor="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="4" className="mx-auto">
                    <div className="input-group mb-3">
                        <Input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            htmlFor="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>

            <Row className="mx-auto justify-content-center">
                <Col lg="2">
                    <a href="/Account/PasswordReset">Forgot Password?</a>
                </Col>
                <Col lg="2" className="d-flex justify-content-end">
                    <Button className="float-right" size="lg" color="primary" type="submit">
                        Login
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col lg="4" className="mx-auto">
                    <a
                        href="/Account/Create"
                        className="d-flex justify-content-center mt-4 font-weight-bold"
                        style={{ color: '#545b62' }}
                    >
                        Create an Account
                    </a>
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
)(Login);
