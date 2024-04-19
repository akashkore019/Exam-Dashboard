import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config' // Import the config file
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const Treatment = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}patients`)
        setPatients(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching patients:', error)
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return (
    <CCard className="mb-5">
      <CCardHeader>Patient Details</CCardHeader>
      <CCardBody>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <CTable responsive="sm">
            <CTableHead>
              <tr>
                <CTableHeaderCell>Full Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Mobile</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Gender</CTableHeaderCell>
                <CTableHeaderCell>Date of Birth</CTableHeaderCell>
                <CTableHeaderCell>Age</CTableHeaderCell>
                <CTableHeaderCell>Weight</CTableHeaderCell>
                <CTableHeaderCell>Blood Group</CTableHeaderCell>
              </tr>
            </CTableHead>
            <CTableBody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <CTableDataCell>{patient.fullName}</CTableDataCell>
                  <CTableDataCell>{patient.email}</CTableDataCell>
                  <CTableDataCell>{patient.mobile}</CTableDataCell>
                  <CTableDataCell>{patient.address}</CTableDataCell>
                  <CTableDataCell>{patient.gender}</CTableDataCell>
                  <CTableDataCell>{patient.dob}</CTableDataCell>
                  <CTableDataCell>{patient.age}</CTableDataCell>
                  <CTableDataCell>{patient.weight}</CTableDataCell>
                  <CTableDataCell>{patient.bloodGroup}</CTableDataCell>
                </tr>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Treatment
