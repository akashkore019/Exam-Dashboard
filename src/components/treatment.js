import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import Select from "react-select";

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
  const [medicine, setMedicine] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: [],
    medicineForms: [],
    medicineName: "",
    medicineId: "",
    dosageName: "",
    durationName: "",
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

  const [editModeIndex, setEditModeIndex] = useState(null);

  const handleEditMedicine = (index) => {
    const medicineDetailToEdit =
      selectedTreatment.treatmentMedicineDetailsList[index];
    setTreatment({
      ...treatment,
      medicineId: medicineDetailToEdit.medicine.medicineId,
      medicineName: medicineDetailToEdit.medicine.medicineName,
      dosageName: medicineDetailToEdit.dosageInstruction,
      durationName: medicineDetailToEdit.duration,
    });
    setEditModeIndex(index);
  };

  const handleDeleteMedicine = (index) => {
    // Check if index is within the range of selectedTreatment.treatmentMedicineDetailsList
    if (index < selectedTreatment.treatmentMedicineDetailsList.length) {
      // If within range, delete from selectedTreatment.treatmentMedicineDetailsList
      const updatedDetailsList = [
        ...selectedTreatment.treatmentMedicineDetailsList.slice(0, index),
        ...selectedTreatment.treatmentMedicineDetailsList.slice(index + 1),
      ];
      setSelectedTreatment({
        ...selectedTreatment,
        treatmentMedicineDetailsList: updatedDetailsList,
      });
    } else {
      // If not within range, calculate the adjusted index for treatmentsList
      const adjustedIndex =
        index - selectedTreatment.treatmentMedicineDetailsList.length;
      // Delete from treatmentsList
      const updatedTreatmentsList = [
        ...treatmentsList.slice(0, adjustedIndex),
        ...treatmentsList.slice(adjustedIndex + 1),
      ];
      setTreatmentsList(updatedTreatmentsList);
    }
  };

  const renderMedicineTableRows = () => {
    console.log(JSON.stringify(selectedTreatment));
    if (!selectedTreatment || !selectedTreatment.treatmentMedicineDetailsList) {
      return null;
    }

    // Combine the selected treatment medicine details with the new treatments list
    const allMedicineDetails = [
      ...selectedTreatment.treatmentMedicineDetailsList,
      ...treatmentsList.map((item) => ({
        medicine: { medicineName: item.medicineName },
        dosageInstruction: item.dosageName,
        duration: item.durationName,
      })),
    ];

    return allMedicineDetails.map((medicineDetail, index) => (
      <CTableRow key={index}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>{medicineDetail.medicine.medicineName}</CTableDataCell>
        <CTableDataCell>{medicineDetail.dosageInstruction}</CTableDataCell>
        <CTableDataCell>{medicineDetail.duration}</CTableDataCell>
        <CTableDataCell>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() => handleDeleteMedicine(index)}
          >
            <FaTrash />
          </CButton>
        </CTableDataCell>
      </CTableRow>
    ));
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
          {/* <Text style={styles.text}>Service: {formData.serviceId}</Text> */}
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
    // alert("hiiiiii");
    // console.log(JSON.stringify(selectedTreatment));

    setSelectedTreatment(selected);
    setShowEditModal(true); // Open the edit modal
  };

  const handleMedicineChange = (selectedOption) => {
    setTreatment({
      ...treatment,
      medicineId: selectedOption ? selectedOption.value : "",
      medicineName: selectedOption ? selectedOption.label : "",
    });
  };

  const [treatmentsList, setTreatmentsList] = useState([]);
  const [dosageOptions] = useState([
    { value: "1:0:0", label: "1:0:0" },
    { value: "1:1:0", label: "1:1:0" },
    { value: "0:1:0", label: "0:1:0" },
    { value: "0:1:1", label: "0:1:1" },
    { value: "1:1:1", label: "1:1:1" },
    { value: "0:0:1", label: "0:0:1" },
    { value: "1:0:1", label: "1:0:1" },
  ]);
  const [durationOptions] = useState([
    { value: "7 days", label: "7 days" },
    { value: "5 days", label: "5 days" },
    { value: "30 days", label: "30 days" },
    { value: "1 day", label: "1 day" },
    { value: "other custom days", label: "Other custom days" },
  ]);

  useEffect(() => {
    fetchMedicines();
  }, []);
  const fetchMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/medicine");
      if (response.status === 200) {
        setMedicine(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // alert(name + value);
    setTreatment({
      ...treatment,
      [name]: value,
    });
  };

  const handleSubmitMedicine = async (event) => {
    event.preventDefault();
    
    // Create a new medicine object with the selected medicine details
    const newMedicine = {
      medicineId: treatment.medicineId,
      medicineName: treatment.medicineName,
      dosageInstruction: treatment.dosageName,
      duration: treatment.durationName,
    };
  
    // Update the selectedTreatment state with the new medicine
    setSelectedTreatment(prevState => ({
      ...prevState,
      medicines: Array.isArray(prevState.medicines) ? [...prevState.medicines, newMedicine] : [newMedicine],
    }));
  };
  
  // Correct the handleSave function

  const handleSave = async () => {
    try {
      // Check if selectedTreatment is defined
      if (!selectedTreatment) {
        throw new Error("Selected treatment is not defined.");
      }

      // Extract necessary data from selectedTreatment state
      const {
        patientId,
        doctorId,
        description,
        treatmentItemDetailsList,
        medicines,
      } = selectedTreatment;

      // Check if patientId and doctorId are defined and are non-empty strings
      if (!patientId || !doctorId) {
        throw new Error("Patient ID or Doctor ID is missing or invalid.");
      }

      // Extract serviceItems from treatmentItemDetailsList
      const serviceItems = treatmentItemDetailsList.map((item) => ({
        id: item.serviceItem.id,
        serviceName: item.serviceItem.serviceName,
        // Add other necessary fields here if needed
      }));

      alert(JSON.stringify(medicines));
      // Construct the medicines array
      const medicinesPayload = medicines.map((medicine) => ({
        medicine: {
          medicineId: medicine.medicineId,
        },
        dosageInstruction: medicine.dosageInstruction,
        duration: medicine.duration,
      }));

      // alert(JSON.stringify(medicinesPayload))
      // Construct the payload to be sent to the API
      const payload = {
        patientId,
        doctorId,
        description,
        serviceItems, // Include serviceItems in the payload
        medicines: medicinesPayload, // Include medicines in the payload
      };

      alert(JSON.stringify(payload));

      // Make the API call to save the data
      const res = await axios.put(
        `http://localhost:8080/api/v1/treatment/${selectedTreatment.id}`,
        payload,
      );

      // Check the response status
      if (res.status === 200) {
        // Reset the form and state after successful save
        setValidated(false);
        setSelectedTreatment({
          patientId: "",
          doctorId: "",
          treatmentItemDetailsList: [],
          medicines: [],
          description: "",
          // Make sure to reset all necessary fields
        });
        setTreatmentsList([]);
        // Optionally show success message
        // window.alert("Treatment data updated successfully!");
      } else {
        throw new Error("Failed to update treatment data");
      }
    } catch (error) {
      console.error("Error:", error);
      // Optionally show error message
      // window.alert("Failed to update treatment data. Please try again later.");
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
                <th>Edit / Delete</th>
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
                  <td style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(treatment.id)}
                      >
                        <AiFillEdit />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(treatment.id)}
                      >
                        <FaTrash />
                      </CButton>
                    </div>
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
                      type="text"
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
                      onChange={(selectedOptions) => {
                        // Update selectedTreatment with the new selected options
                        setSelectedTreatment({
                          ...selectedTreatment,
                          treatmentItemDetailsList: selectedOptions.map(
                            (selectedOption) => ({
                              serviceItem: {
                                id: selectedOption.value,
                                serviceName: selectedOption.label,
                              },
                            }),
                          ),
                        });
                      }}
                      isClearable
                      isMulti
                      value={selectedTreatment.treatmentItemDetailsList.map(
                        (item) => ({
                          value: item.serviceItem.id,
                          label: item.serviceItem.serviceName,
                        }),
                      )}
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

                  {treatment.medicineForms.map((medicineForms, index) => (
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

                  <CCol md={4}>
                    <CFormLabel htmlFor="medicineName">
                      Select Medicine
                    </CFormLabel>
                    <Select
                      options={medicine.map((med) => ({
                        value: med.medicineId,
                        label: med.medicineName,
                      }))}
                      name="medicineId"
                      onChange={handleMedicineChange}
                      required
                    />

                    <CFormFeedback invalid>
                      Please select a medicine.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="dosageName">Select Dosage</CFormLabel>
                    <Select
                      id="dosageName"
                      name="dosageName"
                      options={dosageOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "dosageName",
                            value: selectedOption.value,
                          },
                        })
                      }
                      isClearable
                      placeholder="Select a dosage"
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a Dosage.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="durationName">
                      Select Duration
                    </CFormLabel>
                    <Select
                      id="durationName"
                      name="durationName"
                      options={durationOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "durationName",
                            value: selectedOption.value,
                          },
                        })
                      }
                      isClearable
                      placeholder="Select a duration"
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a duration.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={12}>
                    <CButton color="primary" onClick={handleSubmitMedicine}>
                      Add Medicine
                    </CButton>
                  </CCol>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CCol md={18}>
                      hhhh{" "}
                      <button
                        type="button"
                        className="btn btn-primary "
                        onClick={() => handleSave()} // Call handleSave on click
                      >
                        1111Save
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
