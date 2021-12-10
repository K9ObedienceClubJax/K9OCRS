import React from "react";
import { Row, Col, Button, Input } from "reactstrap";

function PasswordReset() {
  return (
    <form asp-action="PasswordReset" method="post">
      <h1 className="d-flex justify-content-center mt-4 font-weight-bold">
        Password Reset
      </h1>
      <p className="d-flex justify-content-center mt-4 font-weight-bold">
        We will send you an email with the steps to reset your password.
      </p>

      <Row mt="3">
        <Col className="mx-auto" lg="3">
          <div className="input-group mb-3">
            <Input
              type="email"
              className="form-control"
              placeholder="Email Address"
              for="Email"
              name="email"
              value=""
              aria-label="Email"
              aria-describedby="basic-addon1"
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="mx-auto" lg="3">
          <Button
            className="mx-auto d-flex justify-content-center"
            size="lg"
            type="submit"
            color="primary"
          >
            Reset
          </Button>
        </Col>
      </Row>
    </form>
  );
}

export default PasswordReset;
