import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching details for question ID: ${id}`); // Debugging log
    axios
      .get(
        `https://internship.jhamobi.com/projects/t001-m001-p001/controller/get_questions.php?id=${id}`,
      )
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log
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
    return <div>No question found</div>;
  }

  return (
    <div className="container">
      <h2>Question Details</h2>
      <div className="question-details">
        <div>
          <strong>Question ID:</strong> {question.questionID}
        </div>
        <div>
          <strong>Complexity:</strong> {question.complexityLevel}
        </div>
        <div>
          <strong>Program Name:</strong> {question.gradeName}
        </div>
        <div>
          <strong>Course Name:</strong> {question.subjectName}
        </div>
        <div>
          <strong>Question Text:</strong> {question.questionText}
        </div>
        <div>
          <strong>Added On:</strong> {question.addedOn}
        </div>
        <div>
          <strong>Added By:</strong> {question.addedBy}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          {question.status === "1" ? "Active" : "Inactive"}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
