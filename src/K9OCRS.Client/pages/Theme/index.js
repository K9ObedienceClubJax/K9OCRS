import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Carousel from 'react-bootstrap/Carousel';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

import ColorSwatch from './ColorSwatch';

import './style.scss';

const ThemePage = () => {
  return (
    <Container>
      <br />
      <br />
      <Jumbotron>
        <h1>Hello, World!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
        </p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Jumbotron>
      <br />
      <br />
      <ProgressBar now={60} />
      <br />
      <br />
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/800/400"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/800/400"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/800/400"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <br />
      <br />
      {
        [
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
          'light',
          'dark',
        ].map((variant, i) => (
          <Alert key={i} variant={variant} dismissible>
            <Alert.Heading>Test Alert Heading</Alert.Heading>
            <hr/>
            This is a {variant} alert! <Alert.Link href="#">test link</Alert.Link>
          </Alert>
        ))
      }
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
          Library
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>
      <Button variant="primary">Primary</Button>{' '}
      <Button variant="secondary">Secondary</Button>{' '}
      <Button variant="success">Success</Button>{' '}
      <Button variant="warning">Warning</Button>{' '}
      <Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
      <Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
      <Button variant="link">Link</Button>
      <br />
      <Button variant="outline-primary">Primary</Button>{' '}
      <Button variant="outline-secondary">Secondary</Button>{' '}
      <Button variant="outline-success">Success</Button>{' '}
      <Button variant="outline-warning">Warning</Button>{' '}
      <Button variant="outline-danger">Danger</Button>{' '}
      <Button variant="outline-info">Info</Button>{' '}
      <Button variant="outline-light">Light</Button>{' '}
      <Button variant="outline-dark">Dark</Button>
      <br />
      <br />
      <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </DropdownButton>
      <br />
      <br />
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="https://picsum.photos/286/180" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
      <br />
      <br />
      <Nav
        activeKey="/home"
        onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      >
        <Nav.Item>
          <Nav.Link href="/home">Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <br />
      <br />
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} className="text-primary" eventKey="0">
            Click me!
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} className="text-primary" eventKey="1">
            Click me!
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Hello! I'm another body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <br />
      <br />
      <div>
        <h1>
          Example heading <Badge variant="primary">New</Badge>
        </h1>
        <h2>
          Example heading <Badge variant="secondary">New</Badge>
        </h2>
        <h3>
          Example heading <Badge variant="success">New</Badge>
        </h3>
        <h4>
          Example heading <Badge variant="danger">New</Badge>
        </h4>
        <h5>
          Example heading <Badge variant="warning">New</Badge>
        </h5>
        <h6>
          Example heading <Badge variant="light">New</Badge>
        </h6>
      </div>
      <br />
      <br />
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Form.Group>
          <Form.File id="exampleFormControlFile1" label="Example file input" />
        </Form.Group>
        <Form.Group>
          <Form.Control type="text" placeholder="Readonly input here..." readOnly />
        </Form.Group>
        <Form.Group controlId="formBasicRange">
          <Form.Label>Range</Form.Label>
          <Form.Control type="range" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Example select</Form.Label>
          <Form.Control as="select">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>Example multiple select</Form.Label>
          <Form.Control as="select" multiple>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <br />
      <br />
      {
        [
          "ivms-white",
          "ivms-gray-100",
          "ivms-gray-200",
          "ivms-gray-300",
          "ivms-gray-400",
          "ivms-gray-500",
          "ivms-gray-600",
          "ivms-gray-700",
          "ivms-gray-800",
          "ivms-gray-900",
          "ivms-black",
          "ivms-blue",
          "ivms-indigo",
          "ivms-purple",
          "ivms-pink",
          "ivms-red",
          "ivms-orange",
          "ivms-yellow",
          "ivms-green",
          "ivms-teal",
          "ivms-cyan",
        ].map((s, i) => <ColorSwatch key={i} className={s}/>)
      }
      <br />
      <br />
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
      <br />
      <br />
    </Container>
  );
};

export default ThemePage;
