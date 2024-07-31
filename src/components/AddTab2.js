import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

class AddTab2 extends React.Component {
  render() {
    const {
      complexity,
      specifyQuestion,
      questionPic,
      handleInputChange,
      handleNext,
    } = this.props;

    return (
      <Form>
        <FormGroup>
          <Label for="complexity">Complexity *</Label>
          <div>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="complexity"
                  value="Simple"
                  checked={complexity === "Simple"}
                  onChange={handleInputChange}
                />
                Simple
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="complexity"
                  value="Medium"
                  checked={complexity === "Medium"}
                  onChange={handleInputChange}
                />{" "}
                Medium
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="complexity"
                  value="Complex"
                  checked={complexity === "Complex"}
                  onChange={handleInputChange}
                />{" "}
                Complex
              </Label>
            </FormGroup>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="specifyQuestion">Specify Question *</Label>
          <Input
            type="textarea"
            name="specifyQuestion"
            id="specifyQuestion"
            value={specifyQuestion}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="questionPic">Question Pic</Label>
          <Input
            type="file"
            name="questionPic"
            id="questionPic"
            onChange={handleInputChange}
          />
        </FormGroup>
        <Button onClick={handleNext}>Next</Button>
      </Form>
    );
  }
}

export default AddTab2;
