import React, { useState } from "react";
import axios from "axios";
import config from "../config";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CButton,
  CFormSelect,
} from "@coreui/react";

const Doctor = () => {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // State variable to track form submission
  const [doctor, setDoctor] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    gender: "",
    specialization: "",
    experience: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    qualification: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!submitted) {
      // Check if the form has not been submitted before
      try {
        const res = await axios.post(`${config.apiUrl}doctor`, {
          fullName: doctor.fullName,
          email: doctor.email,
          contactNo: doctor.contactNo,
          gender: doctor.gender,
          specialization: doctor.specialization,
          experience: doctor.experience,
          address: doctor.address,
          country: doctor.country,
          city: doctor.city,
          postalCode: doctor.postalCode,
          qualification: doctor.qualification,
        });

        if (res.status === 200) {
          window.alert("Data is submitted Successfully");
          form.reset();
          setSubmitted(true); // Update state to indicate form submission
        } else {
          throw new Error("Failed to submit data");
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert("Failed to submit data. Please try again later.");
      }
    }

    setValidated(true);
  };

  return (
    <CCard className="mb-5">
      <CCardHeader>Doctor Details</CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 ml needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={4}>
            <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
            <CFormInput
              type="text"
              id="fullName"
              name="fullName"
              value={doctor.fullName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the full name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={doctor.email}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter a valid email address.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="contactNo">Contact Number</CFormLabel>
            <CFormInput
              type="text"
              id="contactNo"
              name="contactNo"
              value={doctor.contactNo}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the contact number.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="gender">Gender</CFormLabel>
            <CFormSelect
              id="gender"
              name="gender"
              value={doctor.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </CFormSelect>
            <CFormFeedback invalid>Please select the gender.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="specialization">Specialization</CFormLabel>
            <CFormInput
              type="text"
              id="specialization"
              name="specialization"
              value={doctor.specialization}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the specialization.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="experience">Experience</CFormLabel>
            <CFormInput
              type="text"
              id="experience"
              name="experience"
              value={doctor.experience}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the experience.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <CFormInput
              type="text"
              id="address"
              name="address"
              value={doctor.address}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the address.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="country">Country</CFormLabel>
            <CFormInput
              type="text"
              id="country"
              name="country"
              value={doctor.country}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the country.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="city">City</CFormLabel>
            <CFormInput
              type="text"
              id="city"
              name="city"
              value={doctor.city}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the city.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
            <CFormInput
              type="text"
              id="postalCode"
              name="postalCode"
              value={doctor.postalCode}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the postal code.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="qualification">Qualification</CFormLabel>
            <CFormInput
              type="text"
              id="qualification"
              name="qualification"
              value={doctor.qualification}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the qualification.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol xs={4} />

          <CCol xs={4}>
            <CButton color="primary" type="submit" disabled={submitted}>
              Submit form
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Doctor;
