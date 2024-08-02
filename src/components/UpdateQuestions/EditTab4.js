import React from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";

const EditTab4 = ({
  solutionExplanation,
  solutionPic,
  handleInputChange,
  handleNext,
}) => {
  return (
    <div>
      <FormGroup>
        <Label for="solutionExplanation">Solution Explanation</Label>
        <Input
          type="textarea"
          name="solutionExplanation"
          id="solutionExplanation"
          value={solutionExplanation}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="solutionPic">Solution Picture</Label>
        <Input
          type="file"
          name="solutionPic"
          id="solutionPic"
          onChange={handleInputChange}
        />
        {solutionPic && <img src={URL.createObjectURL(solutionPic)} alt="Solution" style={{ marginTop: '10px', maxWidth: '100%' }} />}
      </FormGroup>
      <Button color="primary" onClick={handleNext}>
        Next
      </Button>
    </div>
  );
};

export default EditTab4;
