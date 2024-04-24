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

const Doctor = () => {
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}doctor`)
        setDoctors(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const columns = [
    { key: 'id', label: 'Id', _props: { scope: 'col' } },
    { key: 'fullName', label: 'Full Name', _props: { scope: 'col' } },
    { key: 'email', label: 'Email', _props: { scope: 'col' } },
    { key: 'contactNo', label: 'Contact No', _props: { scope: 'col' } },
    { key: 'gender', label: 'Gender', _props: { scope: 'col' } },
    { key: 'specialization', label: 'Specialization', _props: { scope: 'col' } },
    { key: 'experience', label: 'Experience', _props: { scope: 'col' } },
    { key: 'address', label: 'Address', _props: { scope: 'col' } },
    { key: 'country', label: 'Country', _props: { scope: 'col' } },
    { key: 'city', label: 'City', _props: { scope: 'col' } },
    { key: 'postalCode', label: 'Postal Code', _props: { scope: 'col' } },
    { key: 'qualification', label: 'Qualification', _props: { scope: 'col' } },
  ]

  return (
    <CCard className="mb-5">
      <CCardBody>
        <div className="table-responsive">
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
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  {columns.map((column) => (
                    <CTableDataCell key={column.key}>
                      {column.key === 'gender'
                        ? doctor[column.key] === 'Male'
                          ? 'M'
                          : 'F'
                        : doctor[column.key]}
                    </CTableDataCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default Doctor