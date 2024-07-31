import React from "react";
import { Button } from "reactstrap";

const AddTab5 = ({
  specifyQuestion,
  options,
  correctOption,
  solutionExplanation,
  handleSubmit,
}) => (
  <div>
    <h5>Preview</h5>
    <p>
      <strong>Question:</strong> {specifyQuestion}
    </p>
    <p>
      <strong>Options:</strong>
    </p>
    <ul>
      {options.map((option, index) => (
        <li
          key={index}
          style={{ fontWeight: correctOption === index ? "bold" : "normal" }}
        >
          {option}
        </li>
      ))}
    </ul>
    <p>
      <strong>Solution Explanation:</strong> {solutionExplanation}
    </p>
    <Button color="primary" onClick={handleSubmit}>
      Submit
    </Button>
  </div>
);

export default AddTab5;
