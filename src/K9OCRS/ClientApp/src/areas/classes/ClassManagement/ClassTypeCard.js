import React from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, CardImg, CardBody, CardTitle, CardText, CardHeader } from 'reactstrap';

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

  const trimmedDesc = description.length > 125 ? description.substring(0, 125) + '...' : description;

  return (
    <div onClick={() => history.push(`/Manage/ClassTypes/${id}`)}>
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
        <Row>
          <Col xs="8" md="6">
            <p className='text-truncate'><strong>Length:</strong> {duration}</p>
          </Col>
          <Col xs="4" md="6" className='d-flex justify-content-end'>
            <p><strong>Price:</strong> ${price}</p>
          </Col>
        </Row>
      </CardBody>
    </div>
  );
};

export default ClassTypeCard;
