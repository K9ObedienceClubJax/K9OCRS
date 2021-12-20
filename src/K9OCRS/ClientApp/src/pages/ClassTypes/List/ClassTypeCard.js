import React from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, CardHeader, CardFooter } from 'reactstrap';

import './style.scss';

const ClassTypeCard = props => {
  const {
    id,
    title,
    description,
    imageUrl,
    duration,
    price,
  } = props;

  const history = useHistory();

  const trimmedDesc = description.substring(0, 120) + '...';

  return (
    <Col className="mb-4" sm="12" md="6" lg="4" xl="3">
      <Card className="classTypeCard h-100" onClick={() => history.push(`/Manage/ClassTypes/${id}`)}>
        <CardImg
          alt={`Image for the ${title} class`}
          src={imageUrl}
          top
        />
        <CardHeader className='bg-primary' style={{'--bs-bg-opacity': .2 }}>
          <CardTitle tag="p" className="h3 d-block text-truncate">{title}</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>{trimmedDesc}</CardText>
          <p><strong>Length:</strong> {duration}</p>
          <p><strong>Price:</strong> ${price}</p>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ClassTypeCard;
