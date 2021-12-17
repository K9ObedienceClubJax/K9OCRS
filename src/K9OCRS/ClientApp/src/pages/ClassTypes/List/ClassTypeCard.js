import React from 'react';
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';
import { NavLink } from 'reactstrap';

const ClassTypeCard = props => {
  const {
    title,
    description,
    imageUrl,
    sessionLength,
    price,
  } = props;

  const trimmedDesc = description.substring(0, 120) + '...';

  return (
    <Col className="mb-4" xs="12" sm="8" md="4">
      <Card>
        <CardImg
          alt="Test Image"
          src={imageUrl}
          top
        />
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardText>{trimmedDesc}</CardText>
          <p><strong>Length:</strong> {sessionLength}</p>
          <p><strong>Price:</strong> ${price}</p>
          <Row className="justify-content-between">
            <Col className="text-right">
              <NavLink href="/Manage/ClassTypes/1">
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
