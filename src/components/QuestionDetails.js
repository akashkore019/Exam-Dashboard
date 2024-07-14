import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button } from "reactstrap";

const QuestionDetails = () => {
  const { id } = useParams(); // Get the question ID from the URL parameters
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `https://internship.jhamobi.com/projects/t001-m001-p001/controller/get_question_details.php?id=${id}`,
      )
      .then((response) => {
        setQuestion(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the question details!",
          error,
        );
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Question Details</h2>
      <p>
        <strong>ID:</strong> {question.questionID}
      </p>
      <p>
        <strong>Question Text:</strong> {question.questionText}
      </p>
      <p>
        <strong>Complexity Level:</strong> {question.complexityLevel}
      </p>
      <p>
        <strong>Program:</strong> {question.gradeName}
      </p>
      <p>
        <strong>Course:</strong> {question.subjectName}
      </p>
      <p>
        <strong>Added On:</strong> {question.addedOn}
      </p>
      <p>
        <strong>Added By:</strong> {question.addedBy}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {question.status === "1" ? "Active" : "Inactive"}
      </p>
      <Link to="/">
        <Button color="primary">Back to List</Button>
      </Link>
    </div>
  );
};

export default QuestionDetails;
