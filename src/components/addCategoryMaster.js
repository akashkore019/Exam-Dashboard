import React, { useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";

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
} from '@coreui/react'

const Doctor = () => {
  const [validated, setValidated] = useState(false)
  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    contactNo: '',
    gender: '',
    specialization: '',
    experience: '',
    address: '',
    country: '',
    city: '',
    postalCode: '',
    qualification: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setDoctor({ ...doctor, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    try {
      const res = await axios.post('http://localhost:8080/api/v1/doctor', {
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
      })

      if (res.status === 200) {
        window.alert('Data is submitted Successfully')
        form.reset()
      } else {
        throw new Error('Failed to submit data')
      }
    } catch (error) {
      console.error('Error:', error)
      window.alert('Failed to submit data. Please try again later.')
    }

    setValidated(true)
  }

  return (
    <CCard className="mb-5">
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
            <Link to="/categoryMaster" className="btn btn-primary">
              Back
            </Link>
          </div>
        </div>
      </CCardHeader>      <CCardBody>
        <CForm
          className="row g-3 ml needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={4}>
            <CFormLabel htmlFor="fullName">Category Name</CFormLabel>
            <CFormInput
              type="text"
              id="Category Name"
              name="Category Name"
              value={doctor.fullName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the qualification.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol xs={4} />
          <CCol xs={4} />

          <CCol xs={4}>
            <CButton color="primary" type="submit">
              Submit
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Doctor
