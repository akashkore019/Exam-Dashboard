import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const EditTab2 = ({
    questionData,
    setQuestionData,
    handleNext,
}) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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
                                checked={questionData.complexity === "Simple"}
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
                                checked={questionData.complexity === "Medium"}
                                onChange={handleInputChange}
                            />
                            Medium
                        </Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Label check>
                            <Input
                                type="radio"
                                name="complexity"
                                value="Complex"
                                checked={questionData.complexity === "Complex"}
                                onChange={handleInputChange}
                            />
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
                    value={questionData.specifyQuestion}
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
};

export default EditTab2;
