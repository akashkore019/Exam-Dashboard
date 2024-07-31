import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./"; // Import your CSS file here
import AddTab1 from "./AddTab1";
import AddTab2 from "./AddTab2";
import AddTab3 from "./AddTab3";
import AddTab4 from "./AddTab4";
import AddTab5 from "./AddTab5";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";

class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      programName: "",
      courseName: "",
      status: "",
      complexity: "Simple",
      specifyQuestion: "",
      questionPic: null,
      options: [""],
      correctOption: 0,
      solutionExplanation: "",
      solutionPic: null,
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  handleInputChange = (event, index) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      this.setState({ [name]: files[0] });
    } else {
      if (name.startsWith("option")) {
        const options = [...this.state.options];
        options[index] = value;
        this.setState({ options });
      } else {
        this.setState({ [name]: value });
      }
    }
  };

  addOption = () => {
    this.setState((prevState) => ({
      options: [...prevState.options, ""],
    }));
  };

  removeOption = (index) => {
    this.setState((prevState) => {
      const options = [...prevState.options];
      options.splice(index, 1);
      return { options };
    });
  };

  handleNext = (currentTab) => {
    const nextTab = (parseInt(currentTab) + 1).toString();
    this.toggle(nextTab);
  };

  handleSubmit = async () => {
    const {
      programName,
      courseName,
      status,
      complexity,
      specifyQuestion,
      questionPic,
      options,
      correctOption,
      solutionExplanation,
      solutionPic,
    } = this.state;

    const questionData = {
      questionID: Math.floor(Math.random() * 1000), // Example ID
      complexityLevel: complexity,
      gradeId: 4, // Example gradeId
      gradeName: programName,
      subjectId: 2, // Example subjectId
      subjectName: courseName,
      unitsId: "", // Example unitsId
      unitsName: "", // Example unitsName
      chapterId: "", // Example chapterId
      chapterName: "", // Example chapterName
      questionText: specifyQuestion,
      questionPic: questionPic ? questionPic.name : "",
      addedOn: new Date().toISOString(),
      addedBy: "admin",
      status: 1, // Example status
      isCompleted: null,
    };

    try {
      const response = await fetch(
        "https://internship.jhamobi.com/projects/t001-m001-p001/controller/get_questions.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([questionData]),
        },
      );

      if (response.ok) {
        console.log("Question submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit question:", errorData);
      }
    } catch (error) {
      console.error("Error submitting question:", error.message);
    }
  };

  render() {
    return (
      <Container>
        <Card>
          <CardBody>
            <CardTitle tag="h5">Add New Question</CardTitle>
            <Nav tabs className="px-5 mb-5">
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "1" ? "active" : ""}
                  onClick={() => this.toggle("1")}
                >
                  Basic Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "2" ? "active" : ""}
                  onClick={() => this.toggle("2")}
                >
                  Question Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "3" ? "active" : ""}
                  onClick={() => this.toggle("3")}
                >
                  Answer Option
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "4" ? "active" : ""}
                  onClick={() => this.toggle("4")}
                >
                  Solution Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={this.state.activeTab === "5" ? "active" : ""}
                  onClick={() => this.toggle("5")}
                >
                  Preview
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1" className="tab-pane-content">
                <AddTab1
                  programName={this.state.programName}
                  courseName={this.state.courseName}
                  status={this.state.status}
                  handleInputChange={this.handleInputChange}
                  handleNext={() => this.handleNext("1")}
                />
              </TabPane>
              <TabPane tabId="2" className="tab-pane-content">
                <AddTab2
                  complexity={this.state.complexity}
                  specifyQuestion={this.state.specifyQuestion}
                  questionPic={this.state.questionPic}
                  handleInputChange={this.handleInputChange}
                  handleNext={() => this.handleNext("2")}
                />
              </TabPane>
              <TabPane tabId="3" className="tab-pane-content">
                <AddTab3
                  options={this.state.options}
                  correctOption={this.state.correctOption}
                  addOption={this.addOption}
                  removeOption={this.removeOption}
                  handleInputChange={this.handleInputChange}
                  handleNext={() => this.handleNext("3")}
                />
              </TabPane>
              <TabPane tabId="4" className="tab-pane-content">
                <AddTab4
                  solutionExplanation={this.state.solutionExplanation}
                  solutionPic={this.state.solutionPic}
                  correctOption={this.state.correctOption}
                  handleInputChange={this.handleInputChange}
                  handleNext={() => this.handleNext("4")}
                />
              </TabPane>
              <TabPane tabId="5" className="tab-pane-content">
                <AddTab5
                  specifyQuestion={this.state.specifyQuestion}
                  options={this.state.options}
                  correctOption={this.state.correctOption}
                  solutionExplanation={this.state.solutionExplanation}
                  handleSubmit={this.handleSubmit}
                />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default AddQuestion;
