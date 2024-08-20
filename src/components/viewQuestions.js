import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
import config from "../config";

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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}get_questions.php`);
                if (response.status === 200) {
                    setQuestions(response.data);
                } else {
                    console.error("Failed to fetch questions. Status:", response.status);
                }
            } catch (error) {
                console.error("There was an error fetching the questions!", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
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
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}>

                                <div className="header-container flex items-center justify-between">
                                    <span>Id</span>
                                    <span className="sort-icon" style={{ marginLeft: "8px" }}>{getSortIcon("questionID")}</span>
                                </div>
                            </th>


                            <th
                                onClick={() => sortQuestions("questionText")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>Ques Text</span>
                                    <span className="sort-icon" style={{ marginLeft: "85%" }}>
                                        {getSortIcon("questionText")}
                                    </span>
                                </div>
                            </th>
                            <th
                                onClick={() => sortQuestions("complexityLevel")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>Complexity</span>
                                    <span className="sort-icon" style={{ marginLeft: "12%" }}>
                                        {getSortIcon("complexityLevel")}
                                    </span>
                                </div>
                            </th>
                            <th
                                onClick={() => sortQuestions("gradeName")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>Program</span>
                                    <span className="sort-icon" style={{ marginLeft: "12%" }}>{getSortIcon("gradeName")}</span>
                                </div>
                            </th>
                            <th
                                onClick={() => sortQuestions("subjectName")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>Course</span>
                                    <span className="sort-icon" style={{ marginLeft: "15px" }}>
                                        {getSortIcon("subjectName")}
                                    </span>
                                </div>
                            </th>
                            <th
                                onClick={() => sortQuestions("addedOn")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>AddedOn</span>
                                    <span className="sort-icon" style={{ marginLeft: "38%" }}>{getSortIcon("addedOn")}</span>
                                </div>
                            </th>
                            <th
                                onClick={() => sortQuestions("addedBy")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>AddedBy</span>
                                    <span className="sort-icon" style={{ marginLeft: "12%" }}>{getSortIcon("addedBy")}</span>
                                </div>
                            </th>
                            <th
                                onClick={() => sortQuestions("status")}
                                style={{ whiteSpace: "nowrap", borderColor: "white" }}
                            >
                                <div className="header-container flex items-center justify-between">
                                    <span>Status</span>
                                    <span className="sort-icon" style={{ marginLeft: "12%" }}>{getSortIcon("status")}</span>
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
                                <td style={{ borderColor: "white" }}>{question.gradeName}</td>
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
                                    {question.status}
                                </td>
                                <td style={{ ...stickyColumnStyle }}>
                                    <div className="flex flex-column">
                                        <Button
                                            color="link"
                                            className="m-0 p-0 mb-1 text-primary"
                                            title="Edit"
                                            tag={Link}
                                            to={{
                                                pathname: `/update_question1/${question.questionID}`,
                                                state: { questionData: question },
                                            }}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            color="link"
                                            className="m-0 p-0 mb-1 text-info"
                                            title="Info"
                                        >
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
                <PaginationItem>
                    <PaginationLink
                        first
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        previous
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                </PaginationItem>
                {Array.from({
                    length: Math.ceil(questions.length / questionsPerPage),
                }).map((_, index) => (
                    <PaginationItem key={index} active={index + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationLink
                        next
                        onClick={() => paginate(currentPage + 1)}
                        disabled={
                            currentPage === Math.ceil(questions.length / questionsPerPage)
                        }
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        last
                        onClick={() =>
                            paginate(Math.ceil(questions.length / questionsPerPage))
                        }
                        disabled={
                            currentPage === Math.ceil(questions.length / questionsPerPage)
                        }
                    />
                </PaginationItem>
            </Pagination>
        </div>
    );
};

export default QuestionList;
