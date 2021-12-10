import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { FaPenSquare, FaCheck } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const myDogs = () => {
    return (
        <Container>
            <h1 style={Heading1}>My Dogs</h1>
            <Row className="DogContainer">
                <Col className="bg-light border" xs="3" >
                    <Row style={profileNameContainer}>
                    <h2>Tommy</h2> &nbsp;&nbsp; <FaPenSquare size="35" />
                    </Row>
                    <img src="https://www.petplace.com/static/34b93d6fa8ec8aa3cdfd706fa8585f98/c85e8/shutterstock_1555613531.png" style={profileImg} alt="dog" />
                </Col>
                <Col className="bg-light border" xs="2" >
                    <Row style={dogDetails}><b>Gender:</b></Row>
                    <Row>Male</Row>
                </Col>
                <Col className="bg-light border" xs="2" >
                    <Row style={dogDetails}><b>Age:</b></Row>
                    <Row>8 weeks</Row>
                </Col>
                <Col className="bg-light border" xs="2" >
                    <Row style={dogDetails}><b>Breed:</b></Row>
                    <Row>Golden Retriever</Row>
                </Col>
                <Col className="bg-light border" xs="2" >
                    <Row style={dogDetails}><b>Vaccinated:</b></Row>
                    <Row style={{display: 'flex', paddingLeft: 40}}><FaCheck/></Row>
                    <Link to="/Account/Dogs/1">
                        <Button style={{display: 'flex', marginTop: 20, }}>View More</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}

const Heading1 = {
    paddingBottom: 25
}

const profileImg = {
    height: 160,
    width: 190,
    borderRadius: 100
}

const profileNameContainer ={
    paddingLeft: 45,
}

const dogDetails = {
    fontSize: 20,
    paddingTop: 70
}

export default myDogs
