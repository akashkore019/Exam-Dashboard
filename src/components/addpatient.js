import React, { useState } from 'react'
import axios from 'axios'
import config from '../config'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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

const Patient = () => {
  const [validated, setValidated] = useState(false)
  const [submitted, setSubmitted] = useState(false) // State variable to track form submission
  const [user, setUser] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    gender: '',
    dob: '',
    age: '',
    weight: '',
    bloodGroup: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    if (!submitted) {
      // Check if the form has not been submitted before
      try {
        const res = await axios.post(`${config.apiUrl}patients`, {
          fullName: user.fullName,
          mobile: user.mobile,
          email: user.email,
          address: user.address,
          gender: user.gender,
          dob: user.dob,
          age: user.age,
          weight: user.weight,
          bloodGroup: user.bloodGroup,
        })

        if (res.status === 200) {
          window.alert('Data submitted successfully!')
          form.reset()
          setSubmitted(true) // Update state to indicate form submission
        } else {
          throw new Error('Failed to submit data')
        }
      } catch (error) {
        console.error('Error:', error)
        window.alert('Failed to submit data. Please try again later.')
      }
    }

    setValidated(true)
  }

  return (
    <CCard className="mb-5">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
          <span style={{ lineHeight: '44px' }}>Patient Details</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <div className="input-group-append">
              <Link to="/PatientDetails" className="btn btn-primary">
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
            <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
            <CFormInput
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your full name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
            <CFormInput
              type="text"
              id="mobile"
              name="mobile"
              value={user.mobile}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your mobile number.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter a valid email address.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <CFormInput
              type="text"
              id="address"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your address.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="gender">Gender</CFormLabel>
            <CFormSelect
              id="gender"
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </CFormSelect>
            <CFormFeedback invalid>Please select your gender.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
            <CFormInput
              type="date"
              id="dob"
              name="dob"
              value={user.dob}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your date of birth.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="age">Age</CFormLabel>
            <CFormInput
              type="number"
              id="age"
              name="age"
              value={user.age}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your age.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="weight">Weight</CFormLabel>
            <CFormInput
              type="number"
              id="weight"
              name="weight"
              value={user.weight}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your weight.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="bloodGroup">Blood Group</CFormLabel>
            <CFormInput
              type="text"
              id="bloodGroup"
              name="bloodGroup"
              value={user.bloodGroup}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your blood group.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol xs={4}>
            <CButton color="primary" type="submit">
              Submit form
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Patient
