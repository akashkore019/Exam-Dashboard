import React, { useState } from 'react'
import axios from 'axios'
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

const Appointment = () => {
  const [validated, setValidated] = useState(false)
  const [submitted, setSubmitted] = useState(false) // State variable to track form submission

  const [appointment, setAppointment] = useState({
    id: '',
    doctor: {
      id: '',
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
    },
    patientName: '',
    patientMobile: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentCreated: '',
    appointmentUpdated: '',
    status: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setAppointment({ ...appointment, [name]: value })
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
      try {
        const res = await axios.post('http://192.168.216.40:8080/api/v1/appointments', appointment)

        if (res.status === 200) {
          window.alert('Appointment data submitted successfully!')
          form.reset()
        } else {
          throw new Error('Failed to submit appointment data')
        }
      } catch (error) {
        console.error('Error:', error)
        window.alert('Failed to submit appointment data. Please try again later.')
      }

      setValidated(true)
    }
  }

  return (
    <CCard className="mb-5">
      <CCardHeader>Appointment Details</CCardHeader>
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
            <CFormFeedback invalid>Please enter the patients name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
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
            <CFormFeedback invalid>Please enter the patients mobile number.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
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
            <CFormFeedback invalid>Please select the appointment date.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
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
            <CFormFeedback invalid>Please select the appointment time.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          {/* Add more fields for appointment details here as needed */}
          <CCol xs={4} />

          <CCol xs={4} />
          <CCol xs={4}>
            <CButton color="primary" type="submit" disabled={submitted}>
              Submit Appointment
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Appointment
