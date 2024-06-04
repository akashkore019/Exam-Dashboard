import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormLabel,
  CButton,
  CFormTextarea,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { CSVLink } from "react-csv";
import Select from "react-select";

import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";

const Treatment = () => {
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false); // Add state for search bar visibility
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [medicineNames, setMedicineNames] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: "",
    medicineForms: [],
    description: "",
  });

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
        "Service Name",
        "Description",
        "Treatment Date",
        "Status",
      ],
      ...treatments.map((treatment) => [
        treatment.patient.fullName,
        treatment.patient.mobile,
        treatment.doctor.fullName,
        treatment.description,
        treatment.treatmentDate,
        treatment.status,
      ]),
    ]);
  }, [treatments]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchServices();
    fetchMedicineNames();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/patients");
      if (response.status === 200) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/doctor");
      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/service");
      if (response.status === 200) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchMedicineNames = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/medicine");
      if (response.status === 200) {
        setMedicineNames(
          response.data.map((medicine) => ({
            value: medicine.id,
            label: medicine.medicineName,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching medicine names:", error);
    }
  };

  const renderMedicineTableRows = () => {
    if (!selectedTreatment || !selectedTreatment.treatmentMedicineDetailsList) {
      return null;
    }

    return selectedTreatment.treatmentMedicineDetailsList.map(
      (medicineDetail, index) => (
        <CTableRow key={index}>
          <CTableDataCell>{index + 1}</CTableDataCell>
          <CTableDataCell>
            {medicineDetail.medicine.medicineName}
          </CTableDataCell>
          <CTableDataCell>{medicineDetail.dosageInstruction}</CTableDataCell>
          <CTableDataCell>{medicineDetail.duration}</CTableDataCell>
        </CTableRow>
      ),
    );
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    heading: {
      fontSize: 20,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
  });

  const InvoicePDF = ({ formData }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>
          <Text style={styles.text}>Patient: {formData.patientId}</Text>
          <Text style={styles.text}>Doctor: {formData.doctorId}</Text>
          <Text style={styles.text}>Service: {formData.serviceId}</Text>
          <Text style={styles.text}>Medicines:</Text>
          {formData.medicineForms.map((medicine, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>
                Medicine {index + 1}: {medicine.medicineId}
              </Text>
              <Text style={styles.text}>Dosage: {medicine.dosage}</Text>
              <Text style={styles.text}>Duration: {medicine.duration}</Text>
            </View>
          ))}
          <Text style={styles.text}>Description: {formData.description}</Text>
        </View>
      </Page>
    </Document>
  );

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
    setSelectedTreatment(selected); // Set selectedTreatment for editing
    setShowEditModal(true);
  };

  // Correct the handleSave function
  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}treatment/${selectedTreatment.treatmentId}`,
        selectedTreatment,
      );
      setShowEditModal(false); // Close modal after saving
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
              <CSVLink data={csvData} filename={"treatment_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Edit</th>
                <th>Delete</th>
                <th>Patient Name</th>
                <th>Patient Mobile</th>
                <th>Doctor Name</th>
                <th>Description</th>
                <th>Treatment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTreatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td onClick={() => handleEdit(treatment.id)}>
                    <AiFillEdit /> {/* Icon for Edit */}
                  </td>
                  <td onClick={() => handleDelete(treatment.id)}>
                    <FaTrash /> {/* Icon for Delete */}
                  </td>
                  <td>{treatment.patient.fullName}</td>
                  <td>{treatment.patient.mobile}</td>
                  <td>{treatment.doctor.fullName}</td>
                  <td>{treatment.description}</td>
                  <td>{treatment.treatmentDate}</td>
                  <td>{treatment.status}</td>
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
            }}
          >
            <CCard style={{ width: "800px" }}>
              {/* Adjust the width as needed */}{" "}
              <CCardHeader
                className="modal-header" // Make sure the className matches the handle
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <span style={{ lineHeight: "44px" }}>Update details</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="input-group-append"
                    style={{ marginRight: "10px" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody>
                <CForm
                  className="mb-3 row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={""}
                >
                  <CCol md={4}>
                    <CFormLabel htmlFor="patientId" style={{ color: "#000" }}>
                      Select Patient
                    </CFormLabel>
                    <Select
                      id="patientId"
                      name="patientId"
                      options={patients.map((patient) => ({
                        value: patient.id,
                        label: patient.fullName,
                      }))}
                      onChange={(selectedOption) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          patientId: selectedOption.value, // Update selectedTreatment
                        })
                      }
                      isClearable
                      placeholder={selectedTreatment.patient.fullName}
                      required
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                    />
                    <CFormFeedback invalid>
                      Please select a patient.
                    </CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="doctorId" style={{ color: "#000" }}>
                      Select Doctor
                    </CFormLabel>
                    <Select
                      id="doctorId"
                      name="doctorId"
                      options={doctors.map((doctor) => ({
                        value: doctor.id,
                        label: doctor.fullName,
                      }))}
                      onChange={(selectedOption) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          doctorId: selectedOption.value, // Update selectedTreatment
                        })
                      }
                      isClearable
                      placeholder={selectedTreatment.doctor.fullName}
                      required
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                    />
                    <CFormFeedback invalid>
                      Please select a doctor.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="serviceId" style={{ color: "#000" }}>
                      Select Service
                    </CFormLabel>
                    <Select
                      id="serviceId"
                      name="serviceId"
                      options={
                        services && services.length > 0
                          ? services.map((service) => ({
                              value: service.id,
                              label: service.serviceName,
                            }))
                          : []
                      }
                      onChange={(selectedOption) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          serviceId: selectedOption.value, // Update selectedTreatment
                        })
                      }
                      isClearable
                      required
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                    />
                    <CFormFeedback invalid>
                      Please select a service.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="treatmentDate"
                      style={{ color: "#000" }}
                    >
                      Update Date
                    </CFormLabel>
                    <input
                      id="treatmentDate"
                      type="date"
                      className="form-control"
                      value={selectedTreatment.treatmentDate}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          treatmentDate: e.target.value, // Update selectedTreatment with the entered date
                        })
                      }
                      required
                      style={{ color: "#000", height: "30px" }}
                    />
                    <CFormFeedback invalid>Please enter a date.</CFormFeedback>
                  </CCol>

                  {treatment.medicineForms.map((medicineForm, index) => (
                    <React.Fragment key={index}>medicineName</React.Fragment>
                  ))}

                  <CCol md={8}>
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CCol md={12}>
                      <button
                        type="button"
                        className="btn btn-primary "
                        onClick={() => handleSave()} // Call handleSave on click
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)} // Close modal on cancel
                      >
                        Cancel
                      </button>
                    </CCol>

                    <div
                      className="input-group-append"
                      style={{ marginRight: "10px" }}
                    >
                      <PDFDownloadLink
                        document={<InvoicePDF formData={treatment} />}
                        fileName="invoice.pdf"
                      >
                        <CButton>
                          <CIcon icon={cilCloudDownload} size="xl" />
                        </CButton>
                      </PDFDownloadLink>
                    </div>
                    <div
                      className="input-group-append"
                      style={{ marginRight: "10px" }}
                    >
                      <CButton onClick={""}>
                        <FaWhatsapp size={25} />
                      </CButton>
                    </div>
                  </div>
                </CForm>

                <CCol xs={12}>
                  <CCard>
                    <CCardHeader>Medicine Details</CCardHeader>
                    <CCardBody>
                      <CTable>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Sr.no</CTableHeaderCell>
                            <CTableHeaderCell>Medicine</CTableHeaderCell>
                            <CTableHeaderCell>Dosage</CTableHeaderCell>
                            <CTableHeaderCell>Duration</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>{renderMedicineTableRows()}</CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Treatment;
