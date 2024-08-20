import React from "react";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { FaTrash } from "react-icons/fa";

const EditTab3 = ({
    questionData,
    setQuestionData,
    handleInputChange,
    addOption,
    removeOption,
    handleNext,
}) => {
    const options = questionData.options || []; // Ensure options is at least an empty array

    return (
        <Form>
            <FormGroup>
                <Label for="answerOptionsType">Answer options would have?</Label>
                {/* (Radio buttons code) */}
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
};

export default EditTab3;
