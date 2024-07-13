import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowUpShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "questionID",
    direction: "ascending",
  });

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

  const sortQuestions = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedQuestions = [...questions].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setQuestions(sortedQuestions);
  };

  // Get the icon for the sorting direction
  const getSortIcon = (key) => {
    const iconStyle = { color: "gray" };
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <FaArrowUpShortWide style={iconStyle} />
      ) : (
        <FaArrowUpWideShort style={iconStyle} />
      );
    }
    return <LuArrowDownUp style={iconStyle} />;
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion,
  );

  // Search filter
  const filteredQuestions = currentQuestions.filter((question) =>
    Object.values(question)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Define the sticky column style
  const stickyColumnStyle = {
    position: "sticky",
    right: 0,
    backgroundColor: "white",
    zIndex: 1,
    whiteSpace: "nowrap",
  };

  return (
    <div className="container">
      <h2 className="mb-4">Questions List</h2>
      <Row className="mb-4 mt-3">
        <Col md="2" className="d-flex align-items-center">
          <label style={{ marginRight: "5px" }}>Show</label>
          <Input
            type="select"
            value={questionsPerPage}
            onChange={(e) => setQuestionsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Input>
          <label style={{ marginLeft: "5px" }}>entries</label>
        </Col>
        <Col className="md=1"></Col>
        <Col md="3" className="d-flex justify-content-end align-items-center">
          <Input
            type="text"
            placeholder="Search"
            className="form-control"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <div style={{ overflowX: "auto" }}>
        <Table striped bordered small>
          <thead>
            <tr>
              <th onClick={() => sortQuestions("questionID")}>
                <div className="header-container">
                  <span>Id</span> {getSortIcon("questionID")}
                </div>
              </th>
              <th onClick={() => sortQuestions("questionText")}>
                <div className="header-container">
                  <span>Ques Text</span> {getSortIcon("questionText")}
                </div>
              </th>
              <th onClick={() => sortQuestions("complexityLevel")}>
                <div className="header-container">
                  <span>Complexity</span> {getSortIcon("complexityLevel")}
                </div>
              </th>
              <th onClick={() => sortQuestions("gradeName")}>
                <div className="header-container">
                  <span>Program</span> {getSortIcon("gradeName")}
                </div>
              </th>
              <th onClick={() => sortQuestions("subjectName")}>
                <div className="header-container">
                  <span>Course</span> {getSortIcon("subjectName")}
                </div>
              </th>
              <th onClick={() => sortQuestions("addedOn")}>
                <div className="header-container">
                  <span>AddedOn</span> {getSortIcon("addedOn")}
                </div>
              </th>
              <th onClick={() => sortQuestions("addedBy")}>
                <div className="header-container">
                  <span>AddedBy</span> {getSortIcon("addedBy")}
                </div>
              </th>
              <th onClick={() => sortQuestions("status")}>
                <div className="header-container">
                  <span>Status</span> {getSortIcon("status")}
                </div>
              </th>
              <th style={stickyColumnStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question) => (
              <tr key={question.questionID}>
                <td style={{ whiteSpace: "nowrap" }}>{question.questionID}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {question.questionText}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {question.complexityLevel}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{question.gradeName}</td>
                <td style={{ whiteSpace: "nowrap" }}>{question.subjectName}</td>
                <td style={{ whiteSpace: "nowrap" }}>{question.addedOn}</td>
                <td style={{ whiteSpace: "nowrap" }}>{question.addedBy}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {question.status === "1" ? "Active" : "Inactive"}
                </td>
                <td style={stickyColumnStyle}>
                  <div className="button-group">
                    <Button color="primary" size="sm">
                      <FaEdit />
                    </Button>
                    <Link
                      to={`/question/${question.questionID}`}
                      className="btn btn-info btn-sm"
                    >
                      <FaInfoCircle />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-3 d-flex justify-content-between">
        <Button
          color="primary"
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
        >
          Previous
        </Button>
        <Pagination>
          {Array.from(
            { length: Math.ceil(questions.length / questionsPerPage) },
            (_, i) => (
              <PaginationItem key={i + 1} active={currentPage === i + 1}>
                <PaginationLink onClick={() => paginate(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
        </Pagination>
        <Button
          color="primary"
          onClick={() =>
            paginate(
              currentPage < Math.ceil(questions.length / questionsPerPage)
                ? currentPage + 1
                : Math.ceil(questions.length / questionsPerPage),
            )
          }
        >
          Next
        </Button>
      </div>

      <style>
        {`
          .table-wrapper {
            position: relative;
          }

          .sticky-column {
            position: -webkit-sticky;
            position: sticky;
            right: 0;
            background-color: white;
            z-index: 1;
          }

          th {
            cursor: pointer;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-container span {
            margin-right: 5px;
          }

          .button-group {
            display: flex;
            gap: 5px;
          }

          .button-group .btn {
            padding: 5px 10px;
            font-size: 14px;
          }

          .button-group .btn-primary {
            background-color: #17a2b8;
            border-color: #17a2b8;
          }

          .button-group .btn-info {
            background-color: #007bff;
            border-color: #007bff;
          }
        `}
      </style>
    </div>
  );
};

export default QuestionList;
