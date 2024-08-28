import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSortAmountUpAlt, FaSortAmountDownAlt, FaEdit, FaInfoCircle } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import { Table, Button, Input, Row, Col, Pagination, PaginationItem, PaginationLink, Spinner } from "reactstrap";
import config from "../config";
import { ClipLoader } from "react-spinners";  // Import the ClipLoader from react-spinners

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "questionID", direction: "ascending" });

    const navigate = useNavigate();

    useEffect(() => {
        // Simulate a loading delay of 5 seconds
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        const fetchQuestions = async () => {
            try {
                const { data, status } = await axios.get(`${config.apiUrl}get_questions.php`);
                if (status === 200) setQuestions(data);
                else console.error("Failed to fetch questions. Status:", status);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();

        // Cleanup the timeout if the component unmounts before 5 seconds
        return () => clearTimeout(loadingTimeout);
    }, []);

    const sortQuestions = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending";
        setSortConfig({ key, direction });

        const sortedQuestions = [...questions].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });

        setQuestions(sortedQuestions);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? (
                <FaSortAmountUpAlt color="gray" />
            ) : (
                <FaSortAmountDownAlt color="gray" />
            );
        }
        return <LuArrowDownUp color="gray" />;
    };


    const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
    const handlePerPageChange = (e) => setQuestionsPerPage(Number(e.target.value));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const filteredQuestions = currentQuestions.filter((question) =>
        Object.values(question).join(" ").toLowerCase().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <ClipLoader size={50} color="#007bff" /> {/* Replace Spinner with ClipLoader */}
            </div>
        );
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
                    <label className="me-2">Show</label>
                    <Input type="select" value={questionsPerPage} onChange={handlePerPageChange} style={{ cursor: "pointer", fontSize: "small" }}>
                        {[10, 25, 50, 100].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </Input>
                    <label className="ms-2">entries</label>
                </Col>
                <Col md="3" className="d-flex justify-content-end align-items-center">
                    <Input type="text" placeholder="Search" className="form-control" onChange={handleSearch} />
                </Col>
            </Row>

            <div style={{ overflowX: "auto" }}>
                <Table striped bordered small style={{ borderCollapse: "collapse", borderColor: "white", fontSize: "small" }}>
                    <thead>
                        <tr>
                            {[
                                { key: "questionID", label: "Id" },
                                { key: "questionText", label: "Ques Text" },
                                { key: "complexityLevel", label: "Complexity" },
                                { key: "gradeName", label: "Program" },
                                { key: "subjectName", label: "Course" },
                                { key: "addedOn", label: "Added On" },
                                { key: "addedBy", label: "Added By" },
                                { key: "status", label: "Status" },
                            ].map(({ key, label }) => (
                                <th key={key} onClick={() => sortQuestions(key)} style={{ whiteSpace: "nowrap", borderColor: "white", textAlign: 'center' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{label}</span>
                                        <span className="ms-1">{getSortIcon(key)}</span>
                                    </div>
                                </th>
                            ))}
                            <th style={{ borderColor: "white", ...stickyColumnStyle }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuestions.map((question) => (
                            <tr key={question.questionID}>
                                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>{question.questionID}</td>
                                <td style={{ borderColor: "white" }}>{question.questionText}</td>
                                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>{question.complexityLevel}</td>
                                <td style={{ borderColor: "white" }}>{question.gradeName}</td>
                                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>{question.subjectName}</td>
                                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>{question.addedOn}</td>
                                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>{question.addedBy}</td>
                                <td style={{ whiteSpace: "nowrap", borderColor: "white" }}>{question.status}</td>
                                <td style={{ ...stickyColumnStyle }}>
                                    <div className="flex flex-column">
                                        <Button color="link" className="m-0 p-0 mb-1 text-primary" tag={Link} to={`/update_question1/${question.questionID}`}>
                                            <FaEdit />
                                        </Button>
                                        <Button color="link" className="m-0 p-0 mb-1 text-info">
                                            <FaInfoCircle />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>


            <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink first onClick={() => handlePageChange(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }).map((_, index) => (
                    <PaginationItem key={index} active={index + 1 === currentPage}>
                        <PaginationLink onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}>
                    <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}>
                    <PaginationLink last onClick={() => handlePageChange(Math.ceil(questions.length / questionsPerPage))} />
                </PaginationItem>
            </Pagination>
        </div>
    );
};

export default QuestionList;
