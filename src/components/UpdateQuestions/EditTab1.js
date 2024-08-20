import React from "react";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";

const EditTab1 = ({
    questionData,
    setQuestionData,
    handleNext,
}) => {

    // Handle input change to update the questionData state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Form>
            <FormGroup row>
                <Label for="programName" sm={2}>
                    Program name:
                </Label>
                <Col sm={10}>
                    <Input
                        type="select"
                        name="gradeName"
                        id="programName"
                        value={questionData.gradeName}
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
                        name="subjectName"
                        id="courseName"
                        value={questionData.subjectName}
                        onChange={handleInputChange}
                    >
                        <option>--Select--</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Technical">Technical</option>
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
                        value={questionData.status}
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

export default EditTab1;
