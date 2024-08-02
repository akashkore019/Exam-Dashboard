import React from "react";
import { Button, FormGroup, Label, Input, Col, Row } from "reactstrap";

const EditTab1 = ({
  programName,
  courseName,
  status,
  handleInputChange,
  handleNext,
}) => {
  return (
    <div>
      <FormGroup>
        <Label for="programName">Program Name</Label>
        <Input
          type="text"
          name="programName"
          id="programName"
          value={programName}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="courseName">Course Name</Label>
        <Input
          type="text"
          name="courseName"
          id="courseName"
          value={courseName}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="status">Status</Label>
        <Input
          type="text"
          name="status"
          id="status"
          value={status}
          onChange={handleInputChange}
        />
      </FormGroup>
      <Button color="primary" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
};

export default EditTab1;
