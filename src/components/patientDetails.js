import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import CIcon from "@coreui/icons-react";
import { cilList, cilPlus, cilSearch } from "@coreui/icons";
import { cilCloudDownload } from "@coreui/icons";
import { CDropdown, CDropdownItem, CDropdownToggle } from "@coreui/react";

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [csvFormat, setCSVFormat] = useState("default");
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredPatients(
      patients.filter((patient) =>
        Object.values(patient).some((value) => {
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchInput.toLowerCase())
          ) {
            return true;
          }
          if (
            typeof value === "number" &&
            value.toString().includes(searchInput)
          ) {
            return true;
          }
          if (typeof value === "object" && value instanceof Date) {
            // Format date of birth for comparison
            const formattedDate = formatDateOfBirth(value);
            return formattedDate
              .toLowerCase()
              .includes(searchInput.toLowerCase());
          }
          return false;
        }),
      ),
    );
  }, [searchInput, patients]);

  useEffect(() => {
    // Update CSV data whenever filteredPatients change
    setCSVData(
      filteredPatients.map((patient) => ({
        ...patient,
        dob: formatDateOfBirth(patient.dob),
      })),
    );
  }, [filteredPatients]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDateOfBirth = (dob) => {
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}patients/${selectedPatient.id}`,
        selectedPatient,
      );
      setShowEditModal(false);
      fetchData(); // Refresh the table
      toast.success("Updated Successfully!", { autoClose: 1000 });
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`${config.apiUrl}patients/${patientId}`);
        fetchData(); // Refresh the table after deletion
        toast.success("Patient deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleCSVFormatChange = (event) => {
    setCSVFormat(event.target.value);
  };

  // Function to handle Add button click
  const handleAdd = () => {
    // Implement logic for adding a new patient
    console.log("Add button clicked");
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Patient Details</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Search button */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleSearchBar}
              style={{ marginRight: "10px" }}
            >
              <CIcon icon={cilSearch} />
            </button>
            {/* Search bar */}
            <div className={`input-group ${searchBarVisible ? "" : "d-none"}`}>
              <input
                type="text"
                placeholder="Search patient details"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addPatient" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"patient_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>{" "}
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Full Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Age</th>
                <th>Weight</th>
                <th>Blood Group</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.fullName}</td>
                  <td>{patient.mobile}</td>
                  <td>{patient.email}</td>
                  <td>{patient.address}</td>
                  <td>{patient.gender}</td>
                  <td>{formatDateOfBirth(patient.dob)}</td>
                  <td>{patient.age}</td>
                  <td>{patient.weight}</td>
                  <td>{patient.bloodGroup}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleEdit(patient)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger text-white"
                      onClick={() => handleDelete(patient.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedPatient && (
        <div
          className="modal"
          style={{ display: showEditModal ? "block" : "none" }}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: "70%", maxHeight: "90vh" }}
          >
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h5 className="modal-title">Update Patient Details:</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowEditModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                {/* Input fields for editing patient details */}
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPatient.fullName}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPatient.mobile}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        mobile: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPatient.email}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPatient.address}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={selectedPatient.gender}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedPatient.dob}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        dob: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedPatient.age}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        age: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedPatient.weight}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        weight: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPatient.bloodGroup}
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        bloodGroup: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Add more input fields for other patient details */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patient;
