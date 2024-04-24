import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CButton,
} from "@coreui/react";

const TreatmentList = () => {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchServices();
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTreatment({ ...treatment, [name]: value });
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
        setSubmitted(true);
        form.reset();
        setValidated(false);
      } else {
        throw new Error("Failed to submit treatment data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit treatment data. Please try again later.");
    }
  };

  return (
    <CCard className="mb-5">
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
          <CCol xs={4} />
          <CCol xs={4} />
          <CCol xs={4}>
            <CButton color="primary" type="submit" disabled={submitted}>
              {submitted ? "Treatment Submitted" : "Submit Treatment"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default TreatmentList;
