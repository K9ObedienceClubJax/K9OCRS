import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { FaPenSquare } from 'react-icons/fa'

const dogDetails = () => {
    return (
        <Container>
            <Row>
                <Col className="bg-light border" xs="3" >
                    <Row style={profileNameContainer}>
                    <h2>Tommy</h2> &nbsp;&nbsp; <FaPenSquare size="35" />
                    </Row>
                <img src="https://www.petplace.com/static/34b93d6fa8ec8aa3cdfd706fa8585f98/c85e8/shutterstock_1555613531.png" style={profileImg} />
                </Col>
                <Col className="bg-light border" xs="4">
                    <Row style={dogDetailsContainer}>
                         <h3>Breed:</h3><br/>
                    </Row>
                    <Row style={dogDetail}>
                        Golden Retriever
                    </Row>
                    <Row style={dogDetailsContainer}>
                         <h3>Age:</h3><br/>
                    </Row>
                    <Row style={dogDetail}>
                        8 weeks
                    </Row>
                    <Row style={dogDetailsContainer}>
                         <h3>Current Class:</h3><br/>
                    </Row>
                    <Row style={dogDetail}>
                        STAR Puppy
                    </Row>
                </Col>
                <Col className="bg-light border" xs="4">
                <Row style={dogDetailsContainer}>
                         <h3>Date of Birth:</h3><br/>
                    </Row>
                    <Row style={dogDetail}>
                        09/10/2021
                    </Row>
                    <Row style={dogDetailsContainer}>
                         <h3>Date of Vaccination:</h3><br/>
                    </Row>
                    <Row style={dogDetail}>
                        11/05/21 (Up to date)
                    </Row>
                    <Row style={dogDetailsContainer}>
                         <h3>Class taken:</h3><br/>
                    </Row>
                    <Row style={dogDetail}>
                        None
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

const profileImg = {
    height: 160,
    width: 190,
    borderRadius: 100
}

const profileNameContainer ={
    paddingLeft: 45,
}

const dogDetailsContainer = {
    paddingTop: 50,
}

const dogDetail = {
    fontSize: 20,
}

export default dogDetails
