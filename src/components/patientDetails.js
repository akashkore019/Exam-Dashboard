import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

      <div className="table-responsive">
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered small>
            <thead>
              <tr>
                <th onClick={() => sortQuestions("questionID")}>Ques Id</th>
                <th onClick={() => sortQuestions("questionText")}>Ques Text</th>
                <th onClick={() => sortQuestions("complexityLevel")}>
                  Complexity
                </th>
                <th onClick={() => sortQuestions("gradeName")}>Program</th>
                <th onClick={() => sortQuestions("subjectName")}>Course</th>
                <th onClick={() => sortQuestions("addedOn")}>AddedOn</th>
                <th onClick={() => sortQuestions("addedBy")}>AddedBy</th>
                <th onClick={() => sortQuestions("status")}>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr key={question.questionID}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {question.questionID}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {question.questionText}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {question.complexityLevel}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{question.gradeName}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {question.subjectName}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{question.addedOn}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{question.addedBy}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {question.status === "1" ? "Active" : "Inactive"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Button color="primary" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Link
                      to={`/question/${question.questionID}`}
                      className="btn btn-info btn-sm"
                    >
                      Info
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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
    </div>
  );
};

export default QuestionList;
