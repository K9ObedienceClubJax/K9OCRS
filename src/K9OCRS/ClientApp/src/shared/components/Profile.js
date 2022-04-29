import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import selectors from '../../shared/modules/selectors';
import * as accountsApi from '../../util/apiClients/userAccounts';
import ProfileContainer from './ProfileContainer';
import { USER_ROLES } from '../../util/accessEvaluator';

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
    setPicture,
    setMember,
    setDiscount
) {
    //API call to get user data
    const inspectedUser = await accountsApi.getUser(id);
    //Set user data
    // setUserID(inspectedUser.id);
    setFirst(inspectedUser.firstName);
    setLast(inspectedUser.lastName);
    setEmail(inspectedUser.email);
    setRole(inspectedUser.userRoleID);
    setPicture(inspectedUser.profilePictureUrl);
    setMember(inspectedUser.isMember);
    setDiscount(inspectedUser.hasDiscounts);
}

async function getDefaultProfile(setPicture) {
    setPicture(await accountsApi.placeholderImage());
}

async function getPasswordLink(setPasswordResetLink, email) {
    setPasswordResetLink(
        await accountsApi.forgotPassword(email, false).then((response) => response.data)
    );
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
    picture,
    imageUpdate,
    member,
    discount
) {
    var formData = new FormData();

    if (userId) {
        formData.append('id', userId);
    }

    formData.append('firstName', first);
    formData.append('lastName', last);
    formData.append('email', email);
    formData.append('isMember', member);
    formData.append('hasDiscounts', discount);

    if (imageUpdate) {
        formData.append('imageUpdate', imageUpdate, imageUpdate.name);
    }

    if (role) {
        formData.append('userRoleId', role);
    }

    if (password) {
        formData.append('password', password);
    }

    if (defaultMode) {
        accountsApi.changeInfo(formData);
        setAlerts([
            {
                color: 'success',
                message: 'Your changes have been saved!',
            },
        ]);
    } else if (createMode) {
        accountsApi.createUser(formData);
        setAlerts([
            {
                color: 'success',
                message: 'User created!',
            },
        ]);
    } else if (inspectMode) {
        accountsApi.changeInfoAdmin(formData);
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
    const [member, setMember] = useState('');
    const [discount, setDiscount] = useState('');
    const [modal, setModal] = useState('');
    const [imageToUpdate, setImageToUpdate] = useState(null);

    const [passwordResetLink, setPasswordResetLink] = useState('');

    const styleObj = {
        marginRight: '6px',
    };

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
        setModal(false);
        if (defaultMode) {
            setUserID(currentUser.id);
            setFirst(currentUser.firstName);
            setLast(currentUser.lastName);
            setEmail(currentUser.email);
            setPicture(currentUser.profilePictureUrl);
            getPasswordLink(setPasswordResetLink, currentUser.email);
            setMember(currentUser.isMember);
            setDiscount(currentUser.hasDiscounts);
        } else if (inspectMode) {
            setUserID(paramsId);
            getUserData(
                paramsId,
                setFirst,
                setLast,
                setEmail,
                setRole,
                setPicture,
                setMember,
                setDiscount
            );
        } else if (createMode) {
            getDefaultProfile(setPicture);
            setMember(false);
            setDiscount(false);
        }
    }, []); // eslint-disable-line

    const userRoleRadios = [];

    for (const [key, value] of Object.entries(USER_ROLES)) {
        userRoleRadios.push(
            <>
                <input
                    key={`${key}_input`}
                    type="radio"
                    className="btn-check"
                    name="role"
                    value={value}
                    id={key}
                    onChange={(e) => setRole(parseInt(e.currentTarget.value))}
                    checked={role === value}
                />
                <label key={`${key}_label`} className="btn btn-outline-secondary" htmlFor={key}>
                    {key}
                </label>
            </>
        );
    }

    userRoleRadios.reverse();

    return (
        <form
            id="profileForm"
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
                    picture,
                    imageToUpdate,
                    member,
                    discount
                );
            }}
        >
            <Col lg={{ size: 10, offset: 1 }}>
                <ProfileContainer
                    modal={modal}
                    setModal={setModal}
                    setImageToUpdate={setImageToUpdate}
                    currentUser={currentUser}
                    picture={picture}
                    setPicture={setPicture}
                />
            </Col>
            <Col lg={{ size: 10, offset: 1 }}>
                <Row className="mt-3">
                    <Col lg={{ size: 3, offset: 3 }}>
                        <div className="input-group mb-3">
                            <Input
                                type="text"
                                autoComplete="off"
                                className="form-control"
                                placeholder="First Name"
                                htmlFor="First"
                                name="first"
                                value={first}
                                onChange={(e) => setFirst(e.target.value)}
                                required
                            />
                        </div>
                    </Col>

                    <Col lg="3">
                        <div className="input-group mb-3">
                            <Input
                                type="text"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Last Name"
                                htmlFor="Last"
                                name="last"
                                value={last}
                                onChange={(e) => setLast(e.target.value)}
                                required
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg="6" className="mx-auto">
                        <div className="input-group mb-3">
                            <Input
                                type="email"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Email Address"
                                htmlFor="Email"
                                name="email"
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
                    <Row className="text-center">
                        {/* eslint-disable-next-line */}
                        <a
                            style={{
                                cursor: 'pointer',
                            }}
                            className="link-info"
                            onClick={() => sendPasswordEmail(email, setAlerts)}
                        >
                            Send user password reset email
                        </a>
                    </Row>
                )}
                {createMode === true && (
                    <Row>
                        <Col lg="6" className="mx-auto">
                            <div className="input-group mb-3">
                                <Input
                                    type="password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    placeholder="Password"
                                    htmlFor="Password"
                                    name="password"
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
                    <Row className="text-center">
                        <a target="_blank" href={passwordResetLink} rel="noopener noreferrer">
                            Change Password
                        </a>
                    </Row>
                )}

                {(inspectMode === true || createMode === true) && (
                    <div className=" mx-auto text-center mt-3">
                        <div className="btn-group">{userRoleRadios}</div>
                    </div>
                )}

                {defaultMode === false && (
                    <div>
                        <div className=" mx-auto text-center mt-3">
                            <Label className="form-check-label">
                                <Input
                                    className="form-check-input"
                                    style={styleObj}
                                    type="checkbox"
                                    name="isMember"
                                    checked={member}
                                    onClick={() => {
                                        if (member) {
                                            setMember(false);
                                        } else {
                                            setMember(true);
                                        }
                                    }}
                                />
                                Member
                            </Label>
                        </div>

                        <div className=" mx-auto text-center mt-3">
                            <Label>
                                <Input
                                    className="form-check-input"
                                    style={styleObj}
                                    type="checkbox"
                                    name="discount"
                                    checked={discount}
                                    onClick={() => {
                                        if (discount) {
                                            setDiscount(false);
                                        } else {
                                            setDiscount(true);
                                        }
                                    }}
                                />
                                Qualifies for Discount
                            </Label>
                        </div>
                    </div>
                )}

                {defaultMode === true && (
                    <div>
                        <div className=" mx-auto text-center mt-3">
                            <Label className="form-check-label">
                                <Input
                                    className="form-check-input"
                                    style={styleObj}
                                    type="checkbox"
                                    name="isMember"
                                    checked={member}
                                    disabled={true}
                                />
                                Member
                            </Label>
                        </div>

                        <div className=" mx-auto text-center mt-3">
                            <Label>
                                <Input
                                    className="form-check-input"
                                    style={styleObj}
                                    type="checkbox"
                                    name="discount"
                                    checked={discount}
                                    disabled={true}
                                />
                                Qualifies for Discount
                            </Label>
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
