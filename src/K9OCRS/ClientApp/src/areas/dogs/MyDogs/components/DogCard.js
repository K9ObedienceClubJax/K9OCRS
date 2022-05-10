import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import classNames from 'classnames';
import '../style.scss';

const DogCard = (props) => {
    const {
        id = 1,
        name = 'Max',
        profilePictureUrl,
        vaccineApproval = 'Pending',
        activeClasses = [],
        pendingApplications = [],
        completedClasses = [],
    } = props;

    const cnVaccineStatus = classNames('vaccine-status', {
        'vaccine-status--approved': vaccineApproval === 'Approved',
        'vaccine-status--pending': vaccineApproval === 'Pending',
        'vaccine-status--denied': vaccineApproval === 'Denied',
    });

    const navigate = useNavigate();

    const gotoDogSetup = () => navigate(`/Account/MyDogs/${id}`);

    return (
        <Row className="dogCard" md="2" xs="1" onClick={gotoDogSetup}>
            <Col className="dogCard__image" md="4" xs="12">
                <img className="dogProfilePic" src={profilePictureUrl} alt="dog" />
            </Col>
            <Col className="dogCard__content" md="8">
                <Row className="dogCard__content-top" md="2" xs="1">
                    <Col xs="12">
                        <h3>{name}</h3>
                    </Col>
                    <Col sm="8" xs="12" className="text-end">
                        <p>
                            <span className="dogCardLabel">Vaccination Record:</span>
                            <span className={`cardLabelValue ${cnVaccineStatus}`}>
                                {vaccineApproval}
                            </span>
                        </p>
                    </Col>
                </Row>
                <div className="dogCard__content-bottom">
                    <p>
                        <span className="dogCardLabel">Active Classes:</span>
                        <span className="cardLabelValue">{activeClasses.length}</span>
                    </p>
                    <p>
                        <span className="dogCardLabel">Pending Class Applications:</span>
                        <span className="cardLabelValue">{pendingApplications.length}</span>
                    </p>
                    <p>
                        <span className="dogCardLabel">Completed Classes:</span>
                        <span className="cardLabelValue">{completedClasses.length}</span>
                    </p>
                </div>
            </Col>
        </Row>
    );
};

export default DogCard;
