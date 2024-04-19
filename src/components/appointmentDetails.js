import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config' // Import the config file

import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const AppointmentDetails = () => {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}appointment`, // Use template literal to include config.apiUrl
        )
        setAppointments(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const columns = [
    { key: 'appointmentId', label: 'Appointment ID', _props: { scope: 'col' } },
    { key: 'patientName', label: 'Patient Name', _props: { scope: 'col' } },
    { key: 'patientMobile', label: 'Patient Mobile', _props: { scope: 'col' } },
    { key: 'appointmentDate', label: 'Appointment Date', _props: { scope: 'col' } },
    { key: 'appointmentTime', label: 'Appointment Time', _props: { scope: 'col' } },
    { key: 'status', label: 'Status', _props: { scope: 'col' } },
  ]

  return (
    <CCard className="mb-5">
      <CCardBody>
        <CTable>
          <CTableHead>
            <tr>
              {columns.map((column) => (
                <CTableHeaderCell {...column._props} key={column.key}>
                  {column.label}
                </CTableHeaderCell>
              ))}
            </tr>
          </CTableHead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                {columns.map((column) => (
                  <CTableDataCell key={column.key}>{appointment[column.key]}</CTableDataCell>
                ))}
              </tr>
            ))}
          </tbody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default AppointmentDetails
