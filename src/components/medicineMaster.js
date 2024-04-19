import React, { useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CButton,
  CFormSelect,
} from '@coreui/react'

const NewMedicineForm = () => {
  const [validated, setValidated] = useState(false)
  const [medicine, setMedicine] = useState({
    medicineId: '',
    medicineName: '',
    medicineType: '',
    medicineContents: '',
    manufacturer: '',
    formType: '',
    dosage: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setMedicine({ ...medicine, [name]: value })
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
      const res = await axios.post('http://192.168.80.40:8080/api/v1/medicine', {
        medicineId: medicine.medicineId,
        medicineName: medicine.medicineName,
        medicineType: medicine.medicineType,
        medicineContents: medicine.medicineContents,
        manufacturer: medicine.manufacturer,
        formType: medicine.formType,
        dosage: medicine.dosage,
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
      <CCardHeader>Medicine Details</CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 ml needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={4}>
            <CFormLabel htmlFor="medicineId">Medicine ID</CFormLabel>
            <CFormInput
              type="text"
              id="medicineId"
              name="medicineId"
              value={medicine.medicineId}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter medicine ID.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="medicineName">Medicine Name</CFormLabel>
            <CFormInput
              type="text"
              id="medicineName"
              name="medicineName"
              value={medicine.medicineName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter medicine name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="medicineType">Medicine Type</CFormLabel>
            <CFormInput
              type="text"
              id="medicineType"
              name="medicineType"
              value={medicine.medicineType}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter medicine type.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="medicineContents">Medicine Contents</CFormLabel>
            <CFormInput
              type="text"
              id="medicineContents"
              name="medicineContents"
              value={medicine.medicineContents}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter medicine contents.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="manufacturer">Manufacturer</CFormLabel>
            <CFormInput
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={medicine.manufacturer}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter manufacturer details.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="formType">Form Type</CFormLabel>
            <CFormSelect
              id="formType"
              name="formType"
              value={medicine.formType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Form Type</option>
              <option value="TAB">TAB</option>
              <option value="CAP">CAP</option>
              <option value="SYP">SYP</option>
              <option value="INF">INF</option>
            </CFormSelect>
            <CFormFeedback invalid>Please select a form type.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="dosage">Dosage</CFormLabel>
            <CFormInput
              type="text"
              id="dosage"
              name="dosage"
              value={medicine.dosage}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter dosage details.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol xs={4} />
          <CCol xs={4} />

          <CCol xs={4}>
            <CButton color="primary" type="submit">
              Add Medicine
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default NewMedicineForm
