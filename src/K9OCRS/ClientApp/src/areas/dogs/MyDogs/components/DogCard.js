import React from 'react'
import Picture from './Picture'
import {Link} from 'react-router-dom'
import classNames from 'classnames';
import '../style.scss'

const DogCard = ({
    id = 1,
    name = "Max",
    vaccineApproval = "Pending",
    activeClasses = [],
    pendingApplications = [],
    completedClasses = []
}) => {

    const cnVaccineStatus = classNames(
        'vaccine-status',
        {
            'vaccine-status--approved': vaccineApproval === 'Approved',
            'vaccine-status--pending': vaccineApproval === 'Pending',
            'vaccine-status--denied': vaccineApproval === 'Denied',
        }
    );

    return (
        <Link to={`/Account/MyDogs/${id}`}>
            <div className='dogCard'>
                <div className='dogCard__image col-xl-3'>
                    <Picture/>
                </div>
                <div className='dogCard__content'>
                    <div className='dogCard__content-top'>
                        <h3>{name}</h3>
                        <p>
                            <span className='dogCardLabel'>Vaccination Record:</span>
                            <span className={`cardLabelValue ${cnVaccineStatus}`}>{vaccineApproval}</span>
                        </p>
                    </div>
                    <div className='dogCard__content-bottom'>
                        <p>
                            <span className='dogCardLabel'>Active Classes:</span>
                            <span className='cardLabelValue'>{activeClasses.length}</span>
                        </p>
                        <p>
                            <span className='dogCardLabel'>Pending Class Applications:</span>
                            <span className='cardLabelValue'>{pendingApplications.length}</span>
                        </p>
                        <p>
                            <span className='dogCardLabel'>Completed Classes:</span>
                            <span className='cardLabelValue'>{completedClasses.length}</span>
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default DogCard
