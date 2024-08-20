import React from "react";
import { Button } from "reactstrap";

const EditTab5 = ({
    questionData,
    handleSubmit,
}) => {
    const options = questionData.options || []; // Ensure options is at least an empty array

    return (
        <div>
            <h5>Preview</h5>
            <p>
                <strong>Question:</strong> {questionData.specifyQuestion}
            </p>
            <p>
                <strong>Options:</strong>
            </p>
            <ul>
                {options.map((option, index) => (
                    <li
                        key={index}
                        style={{ fontWeight: questionData.correctOption === index ? "bold" : "normal" }}
                    >
                        {option}
                    </li>
                ))}
            </ul>
            <p>
                <strong>Solution Explanation:</strong> {questionData.solutionExplanation}
            </p>
            <Button color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
};

export default EditTab5;
