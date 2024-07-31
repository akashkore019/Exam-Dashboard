// AddTab1.js
import React from "react";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";

const AddTab1 = ({
  programName,
  courseName,
  status,
  handleInputChange,
  handleNext,
}) => {
  return (
    <Form>
      <FormGroup row>
        <Label for="programName" sm={2}>
          Program name:
        </Label>
        <Col sm={10}>
          <Input
            type="select"
            name="programName"
            id="programName"
            value={programName}
            onChange={handleInputChange}
          >
            <option>--Select--</option>
            <option value="BCA">BCA</option>
            <option value="B.Cs">B.Cs</option>
            <option value="M.Sc">M.Sc</option>
            <option value="MCA">MCA</option>
            <option value="B.TECH">B.TECH</option>
            <option value="M.TECH">M.TECH</option>
          </Input>
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="courseName" sm={2}>
          Course name:
        </Label>
        <Col sm={10}>
          <Input
            type="select"
            name="courseName"
            id="courseName"
            value={courseName}
            onChange={handleInputChange}
          >
            <option>--Select--</option>
            <option value="Subject">Mathematics</option>
            <option value="Subject">Technical</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="status" sm={2}>
          Status:
        </Label>
        <Col sm={10}>
          <Input
            type="select"
            name="status"
            id="status"
            value={status}
            onChange={handleInputChange}
          >
            <option>--Select--</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Input>
        </Col>
      </FormGroup>
      <Button onClick={handleNext}>Next</Button>
    </Form>
  );
};

export default AddTab1;
