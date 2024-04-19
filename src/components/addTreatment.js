import React, { useState } from 'react'
import axios from 'axios'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
} from '@coreui/react'

const Treatment = () => {
  const [treatment, setTreatment] = useState({
    patient: '',
    doctor: '',
    service: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    description: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setTreatment({ ...treatment, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await axios.post('http://localhost:8080/api/v1/treatment', {
        ...treatment,
      })

      if (res.status === 200) {
        window.alert('Data submitted successfully')
        // Reset form or perform other actions as needed
      } else {
        throw new Error('Failed to submit data')
      }
    } catch (error) {
      console.error('Error:', error)
      window.alert('Failed to submit data. Please try again later.')
    }
  }

  return (
    <CCard>
      <CCardHeader>Add Treatment</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="patient">Select Patient</CFormLabel>
            <CFormInput
              type="text"
              id="patient"
              name="patient"
              value={treatment.patient}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="doctor">Select Doctor</CFormLabel>
            <CFormInput
              type="text"
              id="doctor"
              name="doctor"
              value={treatment.doctor}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="services">Select Services</CFormLabel>
            <CFormInput
              type="text"
              id="service"
              name="service"
              value={treatment.doctor}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Add other form fields (service, medicines, description) here */}
          <CButton type="submit" color="primary">
            Add Medicine
          </CButton>
          <div className="mb-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput
              type="text"
              id="description"
              name="description"
              value={treatment.doctor}
              onChange={handleInputChange}
              required
            />
          </div>
          <CButton type="submit" color="primary">
            Save Treatment
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Treatment
