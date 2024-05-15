import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config'; // Import the config file
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { cilSearch, cilCloudDownload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}category`);
      setCategories(response.data);
      // Generate CSV data
      setCSVData(
        response.data.map((category) => ({
          Id: category.id,
          'Category Name': category.categoryName,
        }))
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'Id', _props: { scope: 'col' } },
    { key: 'categoryName', label: 'Category Name', _props: { scope: 'col' } },
  ];

  return (
    <CCard className="mb-5">
      <CCardHeader
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '5px',
        }}
      >
        <span style={{ lineHeight: '44px' }}>Service Details</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={toggleSearchBar}
            style={{ marginRight: '10px' }}
          >
            <CIcon icon={cilSearch} />
          </button>
          <div className={`input-group ${searchBarVisible ? '' : 'd-none'}`}>
            <input
              type="text"
              placeholder="Search service details"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ height: '30px', marginRight: '10px' }}
            />
          </div>
          <div className="input-group-append" style={{ marginRight: '10px' }}>
            <Link to="/addServices" className="btn btn-primary">
              Add
            </Link>
          </div>
          <div className="input-group-append" style={{ marginRight: '10px' }}>
            <CSVLink data={csvData} filename={'category_data.csv'}>
              <CIcon icon={cilCloudDownload} size="lg" />
            </CSVLink>
          </div>
        </div>
      </CCardHeader>
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
  );
};

export default Category;
