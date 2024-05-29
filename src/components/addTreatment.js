import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

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
  const [services, setServices] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: "",
    medicineForms: [],
    description: "",
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
    setTreatment((prevTreatment) => {
      const updatedMedicineForms = [...prevTreatment.medicineForms];
      updatedMedicineForms[index] = {
        ...updatedMedicineForms[index],
        medicineId: selectedOption ? selectedOption.value : "",
      };
      return { ...prevTreatment, medicineForms: updatedMedicineForms };
    });
  };

  const handleDosageChange = (selectedOption, index) => {
    setTreatment((prevTreatment) => {
      const updatedMedicineForms = [...prevTreatment.medicineForms];
      updatedMedicineForms[index] = {
        ...updatedMedicineForms[index],
        dosage: selectedOption ? selectedOption.value : "",
      };
      return { ...prevTreatment, medicineForms: updatedMedicineForms };
    });
  };

  const handleDurationChange = (selectedOption, index) => {
    setTreatment((prevTreatment) => {
      const updatedMedicineForms = [...prevTreatment.medicineForms];
      updatedMedicineForms[index] = {
        ...updatedMedicineForms[index],
        duration: selectedOption ? selectedOption.value : "",
      };
      return { ...prevTreatment, medicineForms: updatedMedicineForms };
    });
  };

  const handleWhatsAppClick = () => {
    // Logic for WhatsApp click
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
      });
      if (res.status === 200) {
        window.alert("Treatment data submitted successfully!");
        form.reset();
        setValidated(false);
        setTreatment({
          patientId: "",
          doctorId: "",
          serviceId: "",
          medicineForms: [],
          description: "",
        });
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
      medicineForms: [
        ...prevTreatment.medicineForms,
        { medicineId: "", dosage: "", duration: "" },
      ],
    }));
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

  const renderMedicineTableRows = () => {
    return treatment.medicineForms.map((medicine, index) => (
      <CTableRow key={index}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>
          {medicineNames.find((option) => option.value === medicine.medicineId)
            ?.label || ""}
        </CTableDataCell>
        <CTableDataCell>
          {dosageOptions.find((option) => option.value === medicine.dosage)
            ?.label || ""}
        </CTableDataCell>
        <CTableDataCell>
          {durationOptions.find((option) => option.value === medicine.duration)
            ?.label || ""}
        </CTableDataCell>
      </CTableRow>
    ));
  };

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
            <span style={{ lineHeight: "44px" }}>Add Appointment</span>
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
              onSubmit={handleSubmit}
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
                  onChange={(selectedOption) =>
                    setTreatment({
                      ...treatment,
                      serviceId: selectedOption.value,
                    })
                  }
                  isClearable
                  placeholder="Select a service"
                  required
                />
                <CFormFeedback invalid>Please select a service.</CFormFeedback>
              </CCol>

              {treatment.medicineForms.map((medicineForm, index) => (
                <React.Fragment key={index}>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`medicineId_${index}`}>
                      Select Medicine {index + 1}
                    </CFormLabel>
                    <Select
                      id={`medicineId_${index}`}
                      name="medicineId"
                      options={medicineNames}
                      onChange={(selectedOption) =>
                        handleMedicineChange(selectedOption, index)
                      }
                      isClearable
                      placeholder={`Select medicine ${index + 1}`}
                      value={
                        medicineNames.find(
                          (option) => option.value === medicineForm.medicineId,
                        ) || null
                      }
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
                      Please select a medicine.
                    </CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`dosage_${index}`}>
                      Select Dosage
                    </CFormLabel>
                    <Select
                      id={`dosage_${index}`}
                      name="dosage"
                      options={dosageOptions}
                      onChange={(selectedOption) =>
                        handleDosageChange(selectedOption, index)
                      }
                      isClearable
                      placeholder="Select dosage"
                      value={
                        dosageOptions.find(
                          (option) => option.value === medicineForm.dosage,
                        ) || null
                      }
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a dosage.
                    </CFormFeedback>
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`duration_${index}`}>
                      Select Duration
                    </CFormLabel>
                    <Select
                      id={`duration_${index}`}
                      name="duration"
                      options={durationOptions}
                      onChange={(selectedOption) =>
                        handleDurationChange(selectedOption, index)
                      }
                      isClearable
                      placeholder="Select duration"
                      value={
                        durationOptions.find(
                          (option) => option.value === medicineForm.duration,
                        ) || null
                      }
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a duration.
                    </CFormFeedback>
                  </CCol>
                </React.Fragment>
              ))}
              <CCol xs={12}>
                <CButton
                  type="button"
                  color="primary"
                  onClick={handleAddMedicine}
                >
                  <FontAwesomeIcon icon={faPlusCircle} /> Add Medicine
                </CButton>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="input-group-append"
                  style={{ marginRight: "10px" }}
                >
                  <CButton color="primary" type="submit">
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
                    <FaWhatsapp size={25} />{" "}
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
      </CCol>
    </CRow>
  );
};

export default TreatmentList;
