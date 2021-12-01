import React from 'react';
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';

// Dummy Data
const dummyData = [
  {
    title: 'S.T.A.R Puppy',
    description: 'Raising a puppy can be fun and very rewarding and also a big challenge!  The K-9 Obedience Club offers classes to help you train your puppy to become a self-confident, happy and easy-to-live-with companion.',
    heroImageUrl: 'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2020/05/22101125/puppy-being-trained-with-trainer.jpeg',
    sessionLength: '7 weeks',
    price: 140,
  },
  {
    title: 'Advanced Puppy',
    description: 'Continues pup’s education so that he can perform exercises without luring and with distractions. Begins to prepare puppy for AKC Canine Good Citizen',
    heroImageUrl: 'https://dogs.thefuntimesguide.com/files/puppy-training-tips.jpg',
    sessionLength: '7 weeks',
    price: 140,
  },
  {
    title: 'Pet Therapy',
    description: 'K9 Obedience Club of Jacksonville has a long history within the pet therapy community.  Many club members took their beloved dog(s) to facilities in the Jacksonville and Orange Park areas.   We offered pre-assessments and specific classes to help owners hone up their dog\'s training or give guidance to help meet their goals for this rewarding work.',
    heroImageUrl: 'https://www.thesprucepets.com/thmb/HdeC1UgXKFGxIAd4FR1sODW_07s=/480x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-912145654-209bc347a59f42d693a356549ef6cf11.jpg',
    sessionLength: '7 weeks',
    price: 140,
  },
  {
    title: 'Family Dog',
    description: 'This class is suitable for dogs over the age of 6 months that have completed their immunization shots, including rabies   We use positive reinforcement methods and games to make training fun for both the owner and the dog. Dogs will be taught basic obedience skills.',
    heroImageUrl: 'https://www.thesprucepets.com/thmb/HdeC1UgXKFGxIAd4FR1sODW_07s=/480x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-912145654-209bc347a59f42d693a356549ef6cf11.jpg',
    sessionLength: '7 weeks',
    price: 140,
  },
  {
    title: 'Obedience and Rally Skills',
    description: 'This course provides an introduction to the fundamental skills for all Obedience and Rally exercises, including an introduction to attentive heeling, fronts, recalls and stays.',
    heroImageUrl: 'https://www.cesarsway.com/wp-content/uploads/2015/06/agility2-300x200.jpg',
    sessionLength: '6 weeks',
    price: 120,
  }
];

const ClassTypeGrid = () => {
  return (
    <Row className="my-4" xs="1" sm="2" md="3">
      {
        dummyData.map(ct => (
          <ClassTypeCard {...ct} />
        ))
      }
    </Row>
  );
};

const ClassTypeCard = props => {
  const {
    title,
    description,
    heroImageUrl,
    sessionLength,
    price,
  } = props;

  const trimmedDesc = description.substring(0, 120) + '...';

  return (
    <Col className="mb-4" xs="12" sm="8" md="4">
      <Card>
        <CardImg
          alt="Test Image"
          src={heroImageUrl}
          top
        />
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardText>{trimmedDesc}</CardText>
          <p><strong>Length:</strong> {sessionLength}</p>
          <p><strong>Price:</strong> ${price}</p>
          <Row className="justify-content-between">
            <Col className="text-right">
              View More
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ClassTypeGrid;
