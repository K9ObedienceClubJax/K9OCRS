import React from 'react'
import Picture from './Picture'
import {Row, Col} from 'reactstrap'
import {Link} from 'react-router-dom'
import '../style.scss'

const DogCard = ({
    name = "untitled",
    vaccineApproval = "undecided",
    activeClasses = [],
    pendingApplications = [],
    completedClasses = []
}) => {

    return (
        <Link className='CardContainer' to={'/Account/Dogs/1'}>
            <Col>
                <Picture/>
            </Col>
            <Col>
                <Row className='dogCardHeader'>
                    <h3>{name}</h3>
                    <Row>
                        <p className='dogCardLabel'>Vaccination Record:</p>
                        <p className='cardLabelValue'>{vaccineApproval}</p>
                    </Row>
                </Row>
                <Row>
                    <p className='dogCardLabel'>Active Classes: </p>
                    <p className='cardLabelValue'>{activeClasses.length}</p>
                </Row>
                <Row>
                    <p className='dogCardLabel'>Pending Class Applications: </p>
                    <p className='cardLabelValue'>{pendingApplications.length}</p>
                </Row>
                <Row>
                    <p className='dogCardLabel'>Completed Classes: </p>
                    <p className='cardLabelValue'>{completedClasses.length}</p>
                </Row>
            </Col> 
        </Link>
    );
}

export default DogCard
