import React from 'react'
import { Container} from 'reactstrap'
import DogCard from './components/DogCard';
import AddDog from './components/AddDog';
import PageHeader from '../../sharedComponents/PageHeader';

const myDogs = () => {
    return (
        <Container>
            <PageHeader title='My Dogs'/>
            <AddDog/>
            <DogCard/>
        </Container>
    )
}

export default myDogs
