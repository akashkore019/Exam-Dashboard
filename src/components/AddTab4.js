import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

class AddTab4 extends React.Component {
  render() {
    const { solutionExplanation, solutionPic, handleInputChange, handleNext } =
      this.props;

    return (
      <Form>
        <FormGroup>
          <Label for="solutionExplanation">Solution Explanation *</Label>
          <Input
            type="textarea"
            name="solutionExplanation"
            id="solutionExplanation"
            value={solutionExplanation}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="solutionPic">Solution Pic</Label>
          <Input
            type="file"
            name="solutionPic"
            id="solutionPic"
            onChange={handleInputChange}
          />
        </FormGroup>
        <Button onClick={handleNext}>Next</Button>
      </Form>
    );
  }
}

export default AddTab4;
