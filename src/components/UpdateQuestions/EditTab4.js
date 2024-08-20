import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";

const EditTab4 = ({ questionId, handleNext }) => {
    const [data, setData] = useState({
        solutionExplanation: "",
        solutionPic: null,
    });

    useEffect(() => {
        // Fetch data from the database based on questionId
        axios.get(`/api/questions/${questionId}`).then((response) => {
            setData(response.data);
        });
    }, [questionId]);

    const handleFileChange = (e) => {
        setData({
            ...data,
            solutionPic: e.target.files[0],
        });
    };

    return (
        <Form>
            <FormGroup>
                <Label for="solutionExplanation">Solution Explanation *</Label>
                <Input
                    type="textarea"
                    name="solutionExplanation"
                    id="solutionExplanation"
                    value={data.solutionExplanation}
                    onChange={(e) =>
                        setData({ ...data, solutionExplanation: e.target.value })
                    }
                />
            </FormGroup>
            <FormGroup>
                <Label for="solutionPic">Solution Pic</Label>
                <Input
                    type="file"
                    name="solutionPic"
                    id="solutionPic"
                    onChange={handleFileChange}
                />
            </FormGroup>
            <Button onClick={() => handleNext(data)}>Next</Button>
        </Form>
    );
};

export default EditTab4;
