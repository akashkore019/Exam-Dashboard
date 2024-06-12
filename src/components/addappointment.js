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

const Appointment = () => {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppointment] = useState({
    patientName: "",
    patientMobile: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    try {
      const res = await axios.post("${config.apiUrl}appointment", {
        ...appointment,
        status: "Scheduled",
      });
      if (res.status === 200) {
        window.alert("Appointment data submitted successfully!");
        setSubmitted(true);
        form.reset();
        setValidated(false);
      } else {
        throw new Error("Failed to submit appointment data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert(
        "Failed to submit appointment data. Please try again later.",
      );
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
        <span style={{ lineHeight: "44px" }}>Add Appointment</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/appointmentDetails" className="btn btn-primary">
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
            <CFormLabel htmlFor="patientName">Patient Name</CFormLabel>
            <CFormInput
              type="text"
              id="patientName"
              name="patientName"
              value={appointment.patientName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the patient's name.
            </CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="patientMobile">Patient Mobile</CFormLabel>
            <CFormInput
              type="text"
              id="patientMobile"
              name="patientMobile"
              value={appointment.patientMobile}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the patient's mobile number.
            </CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="doctorId">Select Doctor</CFormLabel>
            <select
              id="doctorId"
              name="doctorId"
              className="form-select"
              value={appointment.doctorId}
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
            <CFormLabel htmlFor="appointmentDate">Appointment Date</CFormLabel>
            <CFormInput
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={appointment.appointmentDate}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please select the appointment date.
            </CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="appointmentTime">Appointment Time</CFormLabel>
            <CFormInput
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={appointment.appointmentTime}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please select the appointment time.
            </CFormFeedback>
          </CCol>
          <CCol xs={4} />
          <CCol xs={4} />
          <CCol xs={4}>
            <CButton color="primary" type="submit" disabled={submitted}>
              {submitted ? "Appointment Submitted" : "Submit Appointment"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Appointment;
