import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CCol, CFormLabel } from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import Draggable from "react-draggable";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const Medicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState({
    medicineName: "",
    medicineType: "",
    medicineContents: "",
    manufacturer: "",
    formType: "",
    dosage: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter((medicine) =>
        Object.values(medicine).some((value) => {
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
          return false;
        }),
      ),
    );
  }, [searchInput, medicines]);

  useEffect(() => {
    setCSVData(
      filteredMedicines.map((medicine) => ({
        ...medicine,
      })),
    );
  }, [filteredMedicines]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleEdit = (medicineId) => {
    const medicine = medicines.find(
      (medicine) => medicine.medicineId === medicineId,
    );
    if (medicine) {
      setSelectedAppointment(medicine);
      setShowEditModal(true);
    } else {
      console.error("Medicine not found");
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}medicine/${selectedAppointment.medicineId}`,
        selectedAppointment,
      );
      setShowEditModal(false);
      fetchData(); // Refresh the table
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating medicine:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${config.apiUrl}medicine/${medicineId}`);
        fetchData(); // Refresh the table after deletion
        toast.success("Medicine deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting medicine:", error);
        // Handle error - show toast message or any other UI indication
      }
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Medicine Details</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleSearchBar}
              style={{ marginRight: "10px" }}
            >
              <CIcon icon={cilSearch} />
            </button>
            <div className={`input-group ${searchBarVisible ? "" : "d-none"}`}>
              <input
                type="text"
                placeholder="Search medicine details"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addMedicineMaster" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"medicine_data.csv"}>
              <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>{" "}
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Edit</th>
                <th>Delete</th>
                <th>ID</th>
                <th>Medicine Name</th>
                <th>Medicine Type</th>
                <th>Medicine Contents</th>
                <th>Manufacturer</th>
                <th>Form Type</th>
                <th>Dosage</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.medicineId}>
                  <td onClick={() => handleEdit(medicine.medicineId)}>
                    <AiFillEdit />
                  </td>
                  <td onClick={() => handleDelete(medicine.medicineId)}>
                    <FaTrash />
                  </td>
                  <td>{medicine.medicineId}</td>
                  <td>{medicine.medicineName}</td>
                  <td>{medicine.medicineType}</td>
                  <td>{medicine.medicineContents}</td>
                  <td>{medicine.manufacturer}</td>
                  <td>{medicine.formType}</td>
                  <td>{medicine.dosage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedAppointment && (
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
                  Update Medicine Details
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
                    <CCol md={6}>
                      <CFormLabel htmlFor="medicineName">
                        Medicine Name
                      </CFormLabel>
                      <input
                        type="text"
                        id="medicineName"
                        className="form-control"
                        value={selectedAppointment.medicineName}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            medicineName: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="medicineType">
                        Medicine Type
                      </CFormLabel>
                      <input
                        type="text"
                        id="medicineType"
                        className="form-control"
                        value={selectedAppointment.medicineType}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            medicineType: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="medicineContents">
                        Medicine Contents
                      </CFormLabel>
                      <input
                        type="text"
                        id="medicineContents"
                        className="form-control"
                        value={selectedAppointment.medicineContents}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            medicineContents: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="manufacturer">
                        Manufacturer
                      </CFormLabel>
                      <input
                        type="text"
                        id="manufacturer"
                        className="form-control"
                        value={selectedAppointment.manufacturer}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            manufacturer: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="formType">Form Type</CFormLabel>
                      <input
                        type="text"
                        id="formType"
                        className="form-control"
                        value={selectedAppointment.formType}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            formType: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="dosage">Dosage</CFormLabel>
                      <input
                        type="text"
                        id="dosage"
                        className="form-control"
                        value={selectedAppointment.dosage}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            dosage: e.target.value,
                          })
                        }
                      />
                    </CCol>
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
    </>
  );
};

export default Medicine;
