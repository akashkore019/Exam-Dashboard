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

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion,
  );

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
          <label style={{ marginRight: "5px", cursor: "pointer" }}>Show</label>
          <Input
            type="select"
            style={{ cursor: "pointer", fontSize: "small" }}
            value={questionsPerPage}
            onChange={(e) => setQuestionsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Input>
          <label style={{ marginRight: "5px", cursor: "pointer" }}>
            entries
          </label>
        </Col>
        <Col className="md=1"></Col>
        <Col md="3" className="d-flex justify-content-end align-items-center">
          <Input
            type="text"
            placeholder="Search"
            className="form-control"
            style={{ fontSize: "small" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <div style={{ overflowX: "auto" }}>
        <Table
          striped
          bordered
          small
          style={{
            borderCollapse: "collapse",
            borderColor: "white",
            fontSize: "small",
          }}
        >
          <thead>
            <tr>
              <th
                onClick={() => sortQuestions("questionID")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>Id</span> {getSortIcon("questionID")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("questionText")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>Ques Text</span> {getSortIcon("questionText")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("complexityLevel")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>Complexity</span> {getSortIcon("complexityLevel")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("gradeName")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>Program</span> {getSortIcon("gradeName")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("subjectName")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>Course</span> {getSortIcon("subjectName")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("addedOn")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>AddedOn</span> {getSortIcon("addedOn")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("addedBy")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>AddedBy</span> {getSortIcon("addedBy")}
                </div>
              </th>
              <th
                onClick={() => sortQuestions("status")}
                style={{ borderColor: "white" }}
              >
                <div className="header-container">
                  <span>Status</span> {getSortIcon("status")}
                </div>
              </th>
              <th style={{ borderColor: "white", ...stickyColumnStyle }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question) => (
              <tr key={question.questionID}>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.questionID}
                </td>
                <td style={{ borderColor: "white" }}>
                  {question.questionText}
                </td>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.complexityLevel}
                </td>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.gradeName}
                </td>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.subjectName}
                </td>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.addedOn}
                </td>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.addedBy}
                </td>
                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>
                  {question.status === "1" ? "Active" : "Inactive"}
                </td>
                <td style={{ borderColor: "white", ...stickyColumnStyle }}>
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

      <Row className="mt-4">
        <Col md="6">
          <div style={{ fontSize: "small" }}>
            Showing {indexOfFirstQuestion + 1} to{" "}
            {Math.min(indexOfLastQuestion, questions.length)} of{" "}
            {questions.length} entries
          </div>
        </Col>
        <Col md="6">
          <Pagination className="pagination justify-content-end">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink
                onClick={() => paginate(currentPage - 1)}
                previous
                style={{ fontSize: "small" }}
              />
            </PaginationItem>
            {Array.from(
              {
                length: Math.ceil(questions.length / questionsPerPage),
              },
              (_, index) => (
                <PaginationItem active={index + 1 === currentPage} key={index}>
                  <PaginationLink
                    onClick={() => paginate(index + 1)}
                    style={{ fontSize: "small" }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem
              disabled={
                currentPage === Math.ceil(questions.length / questionsPerPage)
              }
            >
              <PaginationLink
                onClick={() => paginate(currentPage + 1)}
                next
                style={{ fontSize: "small" }}
              />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionList;
