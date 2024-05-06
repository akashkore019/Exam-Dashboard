import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CCol, CFormLabel } from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { Link } from "react-router-dom";

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const formatDateOfBirth = (dob) => {
    const date = new Date(dob);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleEdit = (patientId) => {
    const patient = patients.find((patient) => patient.id === patientId);
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
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating patient:", error);
      // Handle error - show toast message or any other UI indication
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
        // Handle error - show toast message or any other UI indication
      }
    }
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
            <input
              type="text"
              placeholder="Search patient details"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ height: "30px", marginRight: "10px" }} // Adjust height here
            />
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
                      onClick={() => handleEdit(patient.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
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
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{ display: showEditModal ? "block" : "none" }}
          >
            <CCard className="mb-5" style={{ width: "70%", maxHeight: "90vh" }}>
              <CCardHeader
                className="modal-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "move",
                }}
              >
                <span style={{ lineHeight: "44px" }}>
                  Update Patient Details
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </CCardHeader>
              <CCardBody>
                <div className="modal-body" style={{ padding: "10px" }}>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
                  >
                    <CCol md={4}>
                      <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                      <input
                        type="text"
                        id="fullName"
                        className="form-control"
                        value={selectedPatient.fullName}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
                      <input
                        type="text"
                        id="mobile"
                        className="form-control"
                        value={selectedPatient.mobile}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            mobile: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="email">Email</CFormLabel>
                      <input
                        type="text"
                        id="email"
                        className="form-control"
                        value={selectedPatient.email}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            email: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="address">Address</CFormLabel>
                      <input
                        type="text"
                        id="address"
                        className="form-control"
                        value={selectedPatient.address}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            address: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="gender">Gender</CFormLabel>
                      <select
                        id="gender"
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
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
                      <input
                        type="date"
                        id="dob"
                        className="form-control"
                        value={selectedPatient.dob}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            dob: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="age">Age</CFormLabel>
                      <input
                        type="number"
                        id="age"
                        className="form-control"
                        value={selectedPatient.age}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            age: parseInt(e.target.value),
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="weight">Weight</CFormLabel>
                      <input
                        type="number"
                        id="weight"
                        className="form-control"
                        value={selectedPatient.weight}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            weight: parseFloat(e.target.value),
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="bloodGroup">Blood Group</CFormLabel>
                      <input
                        type="text"
                        id="bloodGroup"
                        className="form-control"
                        value={selectedPatient.bloodGroup}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            bloodGroup: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    {/* Add other input fields for patient details */}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSave()}
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
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Patient;
