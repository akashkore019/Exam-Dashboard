import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { FaWhatsapp } from "react-icons/fa"; // Import FaWhatsapp icon

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormLabel,
  CButton,
  CFormTextarea,
} from "@coreui/react";

const TreatmentList = () => {
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: "",
    medicineForms: [], // Array to hold medicine details
  });
  const [medicineNames, setMedicineNames] = useState([]);
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
  const [selectedDosage, setSelectedDosage] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTreatment({ ...treatment, [name]: value });
  };

  const handleMedicineChange = (selectedOption, index) => {
    if (selectedOption) {
      const selectedMedicineId = selectedOption.value;
      setTreatment((prevTreatment) => {
        const updatedMedicineForms = [...prevTreatment.medicineForms];
        updatedMedicineForms[index] = {
          ...updatedMedicineForms[index],
          medicineId: selectedMedicineId,
        };
        return { ...prevTreatment, medicineForms: updatedMedicineForms };
      });
    }
  };

  const handleDosageChange = (selectedOption) => {
    setSelectedDosage(selectedOption);
  };

  const handleDurationChange = (selectedOption) => {
    setSelectedDuration(selectedOption);
  };

  const handleWhatsAppClick = (selectedOption) => {
    //   setSelectedDuration(selectedOption);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/treatment", {
        ...treatment,
        status: "Scheduled",
        dosage: selectedDosage ? selectedDosage.value : "",
        duration: selectedDuration ? selectedDuration.value : "",
      });
      if (res.status === 200) {
        window.alert("Treatment data submitted successfully!");
        form.reset();
        setValidated(false);
        setTreatment({
          patientId: "",
          doctorId: "",
          serviceId: "",
          medicineForms: [], // Reset medicine forms
        });
        setSelectedDosage(null);
        setSelectedDuration(null);
      } else {
        throw new Error("Failed to submit treatment data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit treatment data. Please try again later.");
    }
  };

  const handleAddMedicine = () => {
    setTreatment((prevTreatment) => ({
      ...prevTreatment,
      medicineForms: [...prevTreatment.medicineForms, { medicineId: "" }],
    }));
  };

  // Define PDF styles
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

  // Invoice PDF component
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
            <Text key={index} style={styles.text}>
              Medicine {index + 1}: {medicine.medicineId}, Dosage:{" "}
              {medicine.dosage}, Duration: {medicine.duration}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Add Treatment</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="input-group-append">
                          <CCol xs={12}>
              <CButton color="primary" onClick={handleAddMedicine}>
                Add Medicine
              </CButton>
            </CCol>
              <Link to="/treatment" className="btn btn-primary">
                Back
              </Link>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CForm
            className="row g-3 ml needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={4}>
              <CFormLabel htmlFor="patientId">Select Patient</CFormLabel>
              <select
                id="patientId"
                name="patientId"
                className="form-select"
                value={treatment.patientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName}
                  </option>
                ))}
              </select>
              <CFormFeedback invalid>Please select a patient.</CFormFeedback>
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="doctorId">Select Doctor</CFormLabel>
              <select
                id="doctorId"
                name="doctorId"
                className="form-select"
                value={treatment.doctorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
              <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="serviceId">Select Service</CFormLabel>
              <select
                id="serviceId"
                name="serviceId"
                className="form-select"
                value={treatment.serviceId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
              <CFormFeedback invalid>Please select a service.</CFormFeedback>
            </CCol>
            <CCol xs={12}></CCol>
            <CCol xs={12}></CCol>

          </CForm>
        </CCardBody>
      </CCard>

      {/* Medicine Forms */}
      {treatment.medicineForms.map((medicineForm, index) => (
        <CCard key={index} className="mb-3">
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <span style={{ lineHeight: "44px" }}>Add Medicine</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="input-group-append">
                <CButton onClick={handleAddMedicine}>
                  <FontAwesomeIcon
                    color="primary"
                    size="20px"
                    icon={faPlusCircle}
                    style={{ color: "blak" }}
                  />
                </CButton>
                <button
                  type="button"
                  className="border-none border-0 bg-transparent text-2xl mr-2"
                  onClick={() => {
                    const updatedMedicineForms = [...treatment.medicineForms];
                    updatedMedicineForms.splice(index, 1);
                    setTreatment((prevTreatment) => ({
                      ...prevTreatment,
                      medicineForms: updatedMedicineForms,
                    }));
                  }}
                >
                  <span aria-hidden="true" className="text-gray-700">
                    &times;
                  </span>
                </button>
              </div>
            </div>
          </CCardHeader>

          <CCardBody>
            <CForm
              className="row g-3 ml needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={4}>
                <CFormLabel htmlFor={`medicineId-${index}`}>
                  Search for Medicine
                </CFormLabel>
                <Select
                  id={`medicineId-${index}`}
                  name={`medicineId-${index}`}
                  options={medicineNames}
                  value={medicineNames.find(
                    (medicine) =>
                      medicine.value === parseInt(medicineForm.medicineId),
                  )}
                  onChange={(selectedOption) =>
                    handleMedicineChange(selectedOption.value, index)
                  }
                  isSearchable
                  placeholder="Select Medicine"
                />
                {medicineForm.medicineId === "" && (
                  <CFormFeedback invalid>
                    Please select a medicine.
                  </CFormFeedback>
                )}
              </CCol>

              <CCol md={2}>
                <CFormLabel htmlFor="dosage">Select Dosage</CFormLabel>
                <Select
                  id="dosage"
                  name="dosage"
                  options={dosageOptions}
                  value={selectedDosage}
                  onChange={handleDosageChange}
                  placeholder="Select Dosage"
                />
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="duration">Select Duration</CFormLabel>
                <Select
                  id="duration"
                  name="duration"
                  options={durationOptions}
                  value={selectedDuration}
                  onChange={handleDurationChange}
                  placeholder="Select Duration"
                />
              </CCol>


            </CForm>
          </CCardBody>
        </CCard>
      ))}
              <CCol md={4}>
                {/* <CFormLabel htmlFor="duration">Description</CFormLabel> */}

                <CFormTextarea
                  id="floatingTextarea"
                  floatingLabel="Description:"
                  placeholder="Leave a comment here"
                  style={{ width: "300px" }} // Adjust the width as needed
                />
              </CCol>
      {/* Common Submit Button */}
      <CCol xs={12}>
        <CButton type="submit" color="primary" onClick={handleSubmit}>
          Submit
        </CButton>
      </CCol>

      {/* WhatsApp Button */}
      <div style={{ marginBottom: "20px" }}>
        <button className="btn btn-success me-2" onClick={handleWhatsAppClick}>
          <FaWhatsapp /> WhatsApp
        </button>
      </div>
      {/* Download PDF Button */}
      <div>
        {/* Your form JSX */}
        <PDFDownloadLink
          document={<InvoicePDF formData={treatment} />}
          fileName="invoice.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Generating PDF..." : "Download PDF"
          }
        </PDFDownloadLink>
      </div>
    </>
  );
};

export default TreatmentList;
