import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CCol, CFormLabel } from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const Treatment = () => {
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false); // Add state for search bar visibility

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update CSV data whenever treatments change
    setCSVData([
      [
        "Patient Name",
        "Patient Mobile",
        "Doctor Name",
        "Description",
        "Treatment Date",
        "Status"
      ],
      ...treatments.map((treatment) => [
        treatment.patient.fullName,
        treatment.patient.mobile,
        treatment.doctor.fullName,
        treatment.description,
        treatment.treatmentDate,
        treatment.status
      ])
    ]);
  }, [treatments]);
  

  useEffect(() => {
    // Filter treatments based on search input
    setFilteredTreatments(
      treatments.filter((treatment) =>
        Object.values(treatment).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase()),
        ),
      ),
    );
  }, [searchInput, treatments]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}treatment`);
      setTreatments(response.data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // Define toggleSearchBar function to toggle search bar visibility
  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleSearch = () => {
    setFilteredTreatments(
      treatments.filter((treatment) =>
        Object.values(treatment).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase()),
        ),
      ),
    );
  };

  const handleEdit = (treatmentId) => {
    const selected = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    setSelectedTreatment(selected);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}treatments/${selectedTreatment.id}`,
        selectedTreatment,
      );
      setShowEditModal(false);
      fetchData(); // Refresh the table
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating treatment:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleDelete = async (treatmentId) => {
    if (window.confirm("Are you sure you want to delete this Treatment?")) {
      try {
        await axios.delete(`${config.apiUrl}treatments/${treatmentId}`);
        fetchData(); // Refresh the table after deletion
        toast.success("Treatment deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting Treatment:", error);
        // Handle error - show toast message or any other UI indication
      }
    }
  };

  return (
    <div>
      <CCard className="mb-5">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Treatment Details</span>
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
                placeholder="Search treatment details"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addTreatment" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append">
              <CSVLink
                data={csvData}
                filename={"treatment_data.csv"}
                className="btn btn-secondary"
              >
                <CIcon icon={cilCloudDownload} size="lg" />
                Download CSV
              </CSVLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient Mobile</th>
                <th>Doctor Name</th>
                <th>Description</th>
                <th>Treatment Date</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTreatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td>{treatment.patient.fullName}</td>
                  <td>{treatment.patient.mobile}</td>
                  <td>{treatment.doctor.fullName}</td>
                  <td>{treatment.description}</td>
                  <td>{treatment.treatmentDate}</td>
                  <td>{treatment.status}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleEdit(treatment.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(treatment.id)}
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
      {selectedTreatment && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{
              display: showEditModal ? "block" : "none",
              position: "fixed",
              top: "5%",
              left: "20%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CCard
              className="mb-5 "
              style={{ width: "70%", maxHeight: "90vh" }}
            >
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
  <CFormLabel htmlFor="fullName">Patient Name</CFormLabel>
  <input
    type="text"
    id="fullName"
    className="form-control"
    value={selectedTreatment.patient.fullName}
    onChange={(e) =>
      setSelectedTreatment({
        ...selectedTreatment,
        patient: {
          ...selectedTreatment.patient,
          fullName: e.target.value,
        },
      })
    }
  />
</CCol>
<CCol md={4}>
  <CFormLabel htmlFor="mobile">Patient Mobile</CFormLabel>
  <input
    type="text"
    id="mobile"
    className="form-control"
    value={selectedTreatment.patient.mobile}
    onChange={(e) =>
      setSelectedTreatment({
        ...selectedTreatment,
        patient: {
          ...selectedTreatment.patient,
          mobile: e.target.value,
        },
      })
    }
  />
</CCol>
<CCol md={4}>
  <CFormLabel htmlFor="doctorName">Doctor Name</CFormLabel>
  <input
    type="text"
    id="doctorName"
    className="form-control"
    value={selectedTreatment.doctor.fullName}
    onChange={(e) =>
      setSelectedTreatment({
        ...selectedTreatment,
        doctor: {
          ...selectedTreatment.doctor,
          fullName: e.target.value,
        },
      })
    }
  />
</CCol>
<CCol md={12}>
  <CFormLabel htmlFor="description">Description</CFormLabel>
  <textarea
    id="description"
    className="form-control"
    value={selectedTreatment.description}
    onChange={(e) =>
      setSelectedTreatment({
        ...selectedTreatment,
        description: e.target.value,
      })
    }
  />
</CCol>
<CCol md={4}>
  <CFormLabel htmlFor="treatmentDate">Treatment Date</CFormLabel>
  <input
    type="date"
    id="treatmentDate"
    className="form-control"
    value={selectedTreatment.treatmentDate}
    onChange={(e) =>
      setSelectedTreatment({
        ...selectedTreatment,
        treatmentDate: e.target.value,
      })
    }
  />
</CCol>
<CCol md={4}>
  <CFormLabel htmlFor="status">Status</CFormLabel>
  <input
    type="text"
    id="status"
    className="form-control"
    value={selectedTreatment.status}
    onChange={(e) =>
      setSelectedTreatment({
        ...selectedTreatment,
        status: e.target.value,
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

export default Treatment;
