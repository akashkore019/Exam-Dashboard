import React from "react";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { FaTrash } from "react-icons/fa";

class AddTab3 extends React.Component {
  render() {
    const { options, handleInputChange, addOption, removeOption, handleNext } =
      this.props;

    return (
      <Form>
        <FormGroup>
          <Label for="answerOptionsType">Answer options would have?</Label>
          <div>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="answerOptionsType"
                  value="iconsOnly"
                  onChange={handleInputChange}
                />{" "}
                Icons only
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="answerOptionsType"
                  value="textOnly"
                  onChange={handleInputChange}
                />{" "}
                Text only
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="answerOptionsType"
                  value="iconsText"
                  onChange={handleInputChange}
                />{" "}
                Icons + Text
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="answerOptionsType"
                  value="pictures"
                  onChange={handleInputChange}
                />{" "}
                Pictures
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="answerOptionsType"
                  value="picturesText"
                  onChange={handleInputChange}
                />{" "}
                Pictures + Text
              </Label>
            </FormGroup>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="options">Answer Options *</Label>
          {options.map((option, index) => (
            <Row key={index} className="mb-2">
              <Col xs="2">
                <Label>Option {index + 1}</Label>
              </Col>
              <Col xs="4">
                <Input
                  type="file"
                  name={`option${index}`}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </Col>
              <Col xs="4">
                <Input
                  type="text"
                  name={`optionText${index}`}
                  placeholder="Option text (if applicable)"
                  onChange={(e) => handleInputChange(e, index)}
                />
              </Col>
              <Col xs="2">
                <Button color="danger" onClick={() => removeOption(index)}>
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          ))}
          <Button color="primary" onClick={addOption}>
            Add Option
          </Button>
        </FormGroup>
        <Button color="primary" onClick={handleNext}>
          Next
        </Button>
      </Form>
    );
  }
}

export default AddTab3;
