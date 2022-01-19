import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { FaPenSquare } from 'react-icons/fa'
import Picture from '../MyDogs/components/Picture'
import '../DogDetails/style.scss'
import PageHeader from '../../sharedComponents/PageHeader'

const dogDetails = ({
    dogName = "untitled",
    breed = 'unknown',
    dateOfBirth = 'unknown',
    age = 'unknown',
    vaccineDate = 'undated',
    vaccineApproval = 'undecided',
    currentClass = 'unknown',
    classesTaken = []
    })  => {
    return (
        <Container fluid>
            <div className='d-flex flex-xs-column flex-sm-row'>
                <Col className='py-1' xs='3'>
                    <Row><h2 className='dogName'>{dogName}</h2></Row>
                    <Row><Picture /></Row>
                </Col>   
                <Col className='py-5' xs='3'>
                    <Row><h3>Breed</h3></Row>
                    <Row><p className='labelValue'>{breed}</p></Row>
                    <Row><h3>Age</h3></Row>
                    <Row><p className='labelValue'>{age}</p></Row>
                    <Row><h3>Current Class</h3></Row>
                    <Row><p className='labelValue'>{currentClass}</p></Row>
                </Col>
                <Col className='py-5' xs='3'>
                    <Row><h3>Date of Birth</h3></Row>
                    <Row><p className='labelValue'>{dateOfBirth}</p></Row>
                    <Row><h3>Date of Vaccination</h3></Row>
                    <Row><p className='labelValue'>{vaccineDate} ({vaccineApproval})</p></Row>
                    <Row><h3>Classes Taken</h3></Row>
                    <Row><p className='labelValue'>{classesTaken.length}</p></Row>
                </Col>
            </div>
        </Container>
    );
}

export default dogDetails
