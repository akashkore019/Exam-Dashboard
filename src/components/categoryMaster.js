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

const Category = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}category`, // Use template literal to include config.apiUrl
        )
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const columns = [
    { key: 'id', label: 'Id', _props: { scope: 'col' } },
    { key: 'categoryName', label: 'Category Name', _props: { scope: 'col' } },
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
            {categories.map((category) => (
              <tr key={category.id}>
                {columns.map((column) => (
                  <CTableDataCell key={column.key}>{category[column.key]}</CTableDataCell>
                ))}
              </tr>
            ))}
          </tbody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default Category
