import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';
import { NavLink } from 'reactstrap';

const ClassTypeCard = props => {
  const {
    title,
    description,
    imageUrl,
    duration,
    price,
  } = props;

  const trimmedDesc = description.substring(0, 120) + '...';

  return (
    <Col className="mb-4" xs="12" sm="8" md="4">
      <Card>
        <CardImg
          alt={`Image for the ${title} class`}
          src={imageUrl}
          top
        />
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardText>{trimmedDesc}</CardText>
          <p><strong>Length:</strong> {duration}</p>
          <p><strong>Price:</strong> ${price}</p>
          <Row className="justify-content-between">
            <Col className="text-right">
              <NavLink tag={Link} to="/Manage/ClassTypes/1">
                View More
              </NavLink>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ClassTypeCard;
