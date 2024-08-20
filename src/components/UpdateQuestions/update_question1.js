import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import EditTab1 from "../../components/UpdateQuestions/EditTab1";
import EditTab2 from "../../components/UpdateQuestions/EditTab2";
import EditTab3 from "../../components/UpdateQuestions/EditTab3";
import EditTab4 from "../../components/UpdateQuestions/EditTab4";
import EditTab5 from "../../components/UpdateQuestions/EditTab5";

import axios from "axios";
import config from "../../config";

const UpdateQuestions = () => {
  const { questionID } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("tab1");
  const [questionData, setQuestionData] = useState({
    questionID: "",
    questionText: "",
    complexityLevel: "",
    gradeName: "",
    subjectName: "",
    addedOn: "",
    addedBy: "",
    status: "",
    // Initialize other necessary fields for each EditTab here
  });

  useEffect(() => {
    if (location.state && location.state.questionData) {
      setQuestionData(location.state.questionData);
    } else {
      const fetchQuestionData = async () => {
        try {
          const response = await axios.get(
            `${config.apiUrl}get_question.php?id=${questionID}`
          );
          if (response.status === 200) {
            setQuestionData(response.data);
          } else {
            console.error(
              "Failed to fetch question data. Status:",
              response.status
            );
          }
        } catch (error) {
          console.error(
            "There was an error fetching the question data!",
            error
          );
        }
      };
      fetchQuestionData();
    }
  }, [questionID, location.state]);

  return (
    <div className="container">
      <h2 className="mb-4">Update Question</h2>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Tab eventKey="tab1" title="Edit Tab 1">
          <EditTab1
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleNext={() => setActiveTab("tab2")} // Move to next tab
          />
        </Tab>
        <Tab eventKey="tab2" title="Edit Tab 2">
          <EditTab2
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleNext={() => setActiveTab("tab3")} // Move to next tab
          />
        </Tab>
        <Tab eventKey="tab3" title="Edit Tab 3">
          <EditTab3
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleNext={() => setActiveTab("tab4")} // Move to next tab
            addOption={() => {
              setQuestionData((prevData) => ({
                ...prevData,
                options: [...prevData.options, { text: "", file: null }],
              }));
            }}
            removeOption={(index) => {
              setQuestionData((prevData) => {
                const newOptions = [...prevData.options];
                newOptions.splice(index, 1);
                return { ...prevData, options: newOptions };
              });
            }}
          />
        </Tab>
        <Tab eventKey="tab4" title="Edit Tab 4">
          <EditTab4
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleNext={() => setActiveTab("tab5")} // Move to next tab
          />
        </Tab>
        <Tab eventKey="tab5" title="Edit Tab 5">
          <EditTab5
            questionData={questionData}
            handleSubmit={() => {
              // Handle final form submission here
              console.log("Final submission:", questionData);
            }}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default UpdateQuestions;
