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
            <PageHeader title='My Dogs'/>
            <div className='row justify-content-lg-center justify-content-md-center justify-content-sm-center justify-content-xs-center'> 
                <div className='col-xl-2 col-lg-3 col-md-3 row-sm-12 row-xs-12'>
                    <h2 className='dogName'>{dogName}</h2>
                    <Picture />
                    <br/>
                </div>
                <div className='col-xl-2 col-lg-3 col-md-3 row-sm-12 row-xs-12'>
                    <h3>Breed:</h3>
                    <div className='labelValue'>{breed}</div><br/>
                    <h3>Age:</h3>
                    <div className='labelValue'>{age}</div><br/>
                    <h3>Current Class:</h3>
                    <div className='labelValue'>{currentClass}</div><br/>
                </div>
                <div className='col-xl-2 col-lg-3 col-md-3 row-sm-12 row-xs-12'>
                    <h3>Date of Birth:</h3>
                    <div className='labelValue'>{dateOfBirth}</div><br/>
                    <h3>Date of Vaccination:</h3>
                    <div className='labelValue'>{vaccineDate} ({vaccineApproval})</div><br/>
                    <h3>Classes taken:</h3>
                    <div className='labelValue'>{classesTaken.length}</div>
                </div>
            </div>
        </Container>
    );
}

export default dogDetails
