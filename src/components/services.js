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
const Patient = () => {
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}service`, // Use template literal to include config.apiUrl
        )
        setServices(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const columns = [
    { key: 'id', label: 'Id', _props: { scope: 'col' } },
    { key: 'serviceName', label: 'Service Name', _props: { scope: 'col' } },
    { key: 'charge', label: 'Charge', _props: { scope: 'col' } },
    { key: 'category', label: 'Category', _props: { scope: 'col' } },
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
            {services.map((service) => (
              <tr key={service.id}>
                {columns.map((column) => (
                  <CTableDataCell key={column.key}>
                    {column.key === 'category'
                      ? service[column.key].categoryName
                      : service[column.key]}
                  </CTableDataCell>
                ))}
              </tr>
            ))}
          </tbody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default Patient
