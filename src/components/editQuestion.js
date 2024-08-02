import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Container,
} from "reactstrap";
import config from "../config";

const UpdateQuestion = () => {
  const { questionID } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}get_question.php`, {
          params: { questionID },
        });
        if (response.status === 200) {
          setQuestionData(response.data);
        } else {
          console.error("Failed to fetch question. Status:", response.status);
        }
      } catch (error) {
        console.error("There was an error fetching the question!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.post(
        `${config.apiUrl}update_question.php`,
        questionData,
      );
      if (response.status === 200) {
        navigate("/questions");
      } else {
        console.error("Failed to update question. Status:", response.status);
      }
    } catch (error) {
      console.error("There was an error updating the question!", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spinner color="primary" />;
  }

  if (!questionData) {
    return <div>Question not found.</div>;
  }

  return (
    <Container>
      <h2 className="mb-4">Update Question</h2>
      <Form onSubmit={handleUpdate}>
        <FormGroup>
          <Label for="questionText">Question Text</Label>
          <Input
            type="text"
            name="questionText"
            id="questionText"
            value={questionData.questionText || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="complexityLevel">Complexity Level</Label>
          <Input
            type="text"
            name="complexityLevel"
            id="complexityLevel"
            value={questionData.complexityLevel || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="gradeName">Grade Name</Label>
          <Input
            type="text"
            name="gradeName"
            id="gradeName"
            value={questionData.gradeName || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="subjectName">Subject Name</Label>
          <Input
            type="text"
            name="subjectName"
            id="subjectName"
            value={questionData.subjectName || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="addedOn">Added On</Label>
          <Input
            type="text"
            name="addedOn"
            id="addedOn"
            value={questionData.addedOn || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="addedBy">Added By</Label>
          <Input
            type="text"
            name="addedBy"
            id="addedBy"
            value={questionData.addedBy || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="status">Status</Label>
          <Input
            type="text"
            name="status"
            id="status"
            value={questionData.status || ""}
            onChange={handleInputChange}
          />
        </FormGroup>
        <Button type="submit" color="primary" disabled={updating}>
          {updating ? <Spinner size="sm" /> : "Update"}
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateQuestion;
