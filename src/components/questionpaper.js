import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionPaper = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basicInfo");

  useEffect(() => {
    axios
      .get(
        "https://internship.jhamobi.com/projects/t001-m001-p001/controller/get_questions.php",
      )
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the questions!", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Create New Question Paper</h2>

      {/* Tabs for Basic Info and Questions List */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "basicInfo" ? "active" : ""}`}
            onClick={() => setActiveTab("basicInfo")}
            href="#"
          >
            Basic Info
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "questionsList" ? "active" : ""}`}
            onClick={() => setActiveTab("questionsList")}
            href="#"
          >
            Questions List
          </a>
        </li>
      </ul>

      {/* Content based on active tab */}
      <div className="tab-content mx-5">
        {activeTab === "basicInfo" && (
          <div className="tab-pane fade show active">
            <div className="mb-4 ">
              {/* <h3 className="mb-4 mt-2">Basic Info</h3> */}
              <form className="mx-auto">
                <div className="form-group row mb-3 mt-5">
                  <label className="col-sm-2 col-form-label">
                    Ques Paper Name:
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Question paper 10"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">
                    Program name:
                  </label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <option>MCA</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">
                    Course name:
                  </label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <option>Technical</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">Semester:</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="6"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">
                    Institute Name:
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="ABJ College"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">Exam Date:</label>
                  <div className="col-sm-9">
                    <input
                      type="date"
                      className="form-control"
                      defaultValue="2023-11-01"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">
                    Marks for each question:
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="4"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label className="col-sm-2 col-form-label">
                    Total Marks:
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="20"
                    />
                  </div>
                </div>
                <div className="form-group row ">
                  <label className="col-sm-2 col-form-label">
                    Exam Duration (In Hours):
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="1"
                    />
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label className="col-sm-2 col-form-label">Status:</label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <option>Active</option>
                    </select>
                  </div>
                </div>{" "}
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: "6rem" }}
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "questionsList" && (
          <div className="tab-pane fade show active">
            <div>
              {/* <h3 className="mb-4 mt-2">Questions List</h3> */}
              <div className="mb-3 d-flex justify-content-between align-items-center mb-2 mt-3">
                <div className="d-flex align-items-center">
                  <label style={{ marginRight: "10px" }}>Show</label>
                  <select>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <label style={{ marginLeft: "10px" }}>entries</label>
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="table-responsive mx-5">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Ques Id</th>
                      <th>Ques Text</th>
                      <th>Complexity</th>
                      <th>Program</th>
                      <th>Course</th>
                      <th>Question Count</th>
                      <th>Choose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.questionID}>
                        <td>{question.questionID}</td>
                        <td>{question.questionText}</td>
                        <td>{question.complexityLevel}</td>
                        <td>{question.gradeName}</td>
                        <td>{question.subjectName}</td>
                        <td>1</td>
                        <td>
                          <input type="checkbox" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-primary">Previous</button>
              </div>
            </div>
            <button className="btn btn-primary mt-3">Add Question Set</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPaper;
