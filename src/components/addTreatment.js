import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { FaWhatsapp } from "react-icons/fa";
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

const TreatmentList = () => {
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicine, setMedicine] = useState([]);

  const [services, setServices] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: [],
    medicineName: "",
    medicineId: "",
    dosageName: "",
    durationName: "",
    description: "",
  });

  const [treatmentsList, setTreatmentsList] = useState([]);
  const navigate = useNavigate();

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
    fetchPatients();
    fetchDoctors();
    fetchServices();
    fetchMedicines();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("${config.apiUrl}patients");
      if (response.status === 200) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("${config.apiUrl}doctor");
      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("${config.apiUrl}service");
      if (response.status === 200) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("${config.apiUrl}medicine");
      if (response.status === 200) {
        setMedicine(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target; // Use event.target instead of event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true); // Move inside the if block to only set validated if form is invalid
      return; // Exit early if form is invalid
    }

    try {
      const serviceIds = Array.isArray(treatment.serviceId)
        ? treatment.serviceId.map((service) => service.value)
        : [];

      const medicines = treatmentsList.map((item) => ({
        medicineId: item.medicineId,
        dosageInstruction: item.dosageName,
        duration: item.durationName,
      }));

      const res = await axios.post("${config.apiUrl}treatment", {
        patientId: treatment.patientId,
        doctorId: treatment.doctorId,
        serviceItems: serviceIds.map((serviceId) => ({ id: serviceId })),
        medicines: medicines.map((medicine) => ({
          medicine: {
            medicineId: medicine.medicineId,
          },
          dosageInstruction: medicine.dosageInstruction,
          duration: medicine.duration,
        })),
        description: treatment.description,
      });

      alert(JSON.stringify(serviceIds));

      if (res.status === 200) {
        window.alert("Treatment data submitted successfully!");
        form.reset();
        setValidated(false);
        setTreatment({
          patientId: "",
          doctorId: "",
          serviceId: [],
          medicineName: "",
          dosageName: "",
          durationName: "",
          description: "",
        });
        setTreatmentsList([]);
        navigate("/treatment");
      } else {
        throw new Error("Failed to submit treatment data");
      }
    } catch (error) {
      navigate("/treatment");
      // console.error("Error:", error);
      // window.alert("Failed to submit treatment data. Please try again later.");
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

  const handleServiceChange = (selectedOption) => {
    setTreatment({
      ...treatment,
      serviceId: selectedOption || [],
    });
  };

  const handleMedicineChange = (selectedOption) => {
    setTreatment({
      ...treatment,
      medicineId: selectedOption ? selectedOption.value : "",
      medicineName: selectedOption ? selectedOption.label : "",
    });
  };

  const handleSubmitMedicine = async (event) => {
    event.preventDefault();
    setTreatmentsList([...treatmentsList, treatment]);
  };

  const InvoicePDF = ({ formData }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>
          <Text style={styles.text}>Patient: {formData.patientId}</Text>
          <Text style={styles.text}>Doctor: {formData.doctorId}</Text>
          <Text style={styles.text}>
            Service: {formData.serviceId.join(", ")}
          </Text>
          <Text style={styles.text}>Medicines:</Text>

          <Text style={styles.text}>Description: {formData.description}</Text>
        </View>
      </Page>
    </Document>
  );

  const handleWhatsAppClick = () => {
    // Logic for WhatsApp click
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

  return (
    <CRow>
      <CCol>
        <CCard>
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
                <Link to="/treatment" className="btn btn-primary">
                  Back
                </Link>
              </div>
            </div>
          </CCardHeader>{" "}
          <CCardBody>
            <CForm
              className="mb-3 row g-3 needs-validation"
              noValidate
              validated={validated}
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
                    setTreatment({
                      ...treatment,
                      patientId: selectedOption.value,
                    })
                  }
                  isClearable
                  placeholder="Select a patient"
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
                <CFormFeedback invalid>Please select a patient.</CFormFeedback>
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
                    setTreatment({
                      ...treatment,
                      doctorId: selectedOption.value,
                    })
                  }
                  isClearable
                  placeholder="Select a doctor"
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
                <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="serviceId">Select Service</CFormLabel>
                <Select
                  id="serviceId"
                  name="serviceId"
                  options={services.map((service) => ({
                    value: service.id,
                    label: service.serviceName,
                  }))}
                  onChange={handleServiceChange}
                  isClearable
                  placeholder="Select a service"
                  isMulti
                  required
                />
                <CFormFeedback invalid>Please select a service.</CFormFeedback>
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={treatment.description}
                  onChange={handleInputChange}
                  required
                />
                <CFormFeedback invalid>
                  Please provide a description.
                </CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="medicineName">Select Medicine</CFormLabel>
                <Select
                  options={medicine.map((med) => ({
                    value: med.medicineId,
                    label: med.medicineName,
                  }))}
                  name="medicineId"
                  onChange={handleMedicineChange}
                  required
                />

                <CFormFeedback invalid>Please select a medicine.</CFormFeedback>
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
                <CFormFeedback invalid>Please select a Dosage.</CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="durationName">Select Duration</CFormLabel>
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
                <CFormFeedback invalid>Please select a duration.</CFormFeedback>
              </CCol>
              <CCol md={12}>
                <CButton color="primary" onClick={handleSubmitMedicine}>
                  Add Medicine
                </CButton>
              </CCol>
            </CForm>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Medicine</CTableHeaderCell>
                  <CTableHeaderCell>Dosage</CTableHeaderCell>
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {treatmentsList.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.medicineName}</CTableDataCell>
                    <CTableDataCell>{item.dosageName}</CTableDataCell>
                    <CTableDataCell>{item.durationName}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="input-group-append"
                style={{ marginRight: "10px" }}
              >
                <CButton color="primary" type="submit" onClick={handleSubmit}>
                  Submit
                </CButton>
              </div>
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
                <CButton onClick={handleWhatsAppClick}>
                  <FaWhatsapp size={25} />
                </CButton>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default TreatmentList;
