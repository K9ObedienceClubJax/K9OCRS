import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, CardHeader } from 'reactstrap';
import { formatCurrency } from 'src/util/numberFormatting';

import './style.scss';

const ClassCard = (props) => {
    const { id, title, description, imageUrl, duration, price } = props;

    const navigate = useNavigate();

    const trimmedDesc =
        description.length > 125 ? description.substring(0, 125) + '...' : description;

    return (
        <Col className="mb-4" sm="12" md="6" lg="4" xl="3">
            <Card className="classCard h-100" onClick={() => navigate(`/Classes/${id}`)}>
                <CardImg alt={`Image for the ${title} class`} src={imageUrl} top />
                <CardHeader className="bg-primary" style={{ '--bs-bg-opacity': 0.2 }}>
                    <CardTitle tag="p" className="h3 d-block text-truncate">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <CardText>{trimmedDesc}</CardText>
                    <Row>
                        <Col xs="8" md="6">
                            <p className="text-truncate">
                                <strong>Length:</strong> {duration}
                            </p>
                        </Col>
                        <Col xs="4" md="6" className="d-flex justify-content-end">
                            <p>
                                <strong>Price:</strong> {formatCurrency(price)}
                            </p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    );
};

export default ClassCard;
