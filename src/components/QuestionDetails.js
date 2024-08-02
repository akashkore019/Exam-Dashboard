import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CSpinner } from "@coreui/react";
import config from "../config";

const QuestionDetails = () => {
  const { questionID } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}get_question.php`, {
          params: { questionID },
        });
        if (response.status === 200) {
          setQuestion(response.data);
        } else {
          console.error(
            "Failed to fetch question details. Status:",
            response.status,
          );
        }
      } catch (error) {
        console.error(
          "There was an error fetching the question details!",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionID]);

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }

  return (
    <div>
      {question ? (
        <div>
          <h1>{question.title}</h1>
          <p>{question.content}</p>
          {/* Render other question details here */}
        </div>
      ) : (
        <p>Question not found</p>
      )}
    </div>
  );
};

export default QuestionDetails;
