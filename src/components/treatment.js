import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const Treatment = () => {
  const [treatments, setTreatments] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false); // Add state for search bar visibility

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update CSV data whenever treatments change
    setCSVData(
      treatments.map((treatment) => ({
        "Patient Name": treatment.patient.fullName,
        "Patient Mobile": treatment.patient.mobile,
        "Doctor Name": treatment.doctor.fullName,
        Description: treatment.description,
        "Treatment Date": treatment.treatmentDate,
        Status: treatment.status,
      })),
    );
  }, [treatments]);

  useEffect(() => {
    // Filter treatments based on search input
    setFilteredTreatments(
      treatments.filter((treatment) =>
        Object.values(treatment).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase())
        )
      )
    );
  }, [searchInput, treatments]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}treatment`);
      setTreatments(response.data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  // Define toggleSearchBar function to toggle search bar visibility
  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleSearch = () => {
    setFilteredTreatments(
      treatments.filter((treatment) =>
        Object.values(treatment).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase())
        )
      )
    );
  };

  return (
    <CCard className="mb-5">
      <CCardHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <span style={{ lineHeight: "44px" }}>Treatment Details</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Search button */}
          <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleSearchBar}
              style={{ marginRight: "10px" }}
            >
              <CIcon icon={cilSearch} />
            </button>
          {/* Search bar */}
          <div className={`input-group ${searchBarVisible ? "" : "d-none"}`}>
            <input
              type="text"
              placeholder="Search treatment details"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ height: "30px", marginRight: "10px" }}
            />
            
          </div>
          <div className="input-group-append" style={{ marginRight: "10px" }}>
            <Link to="/addTreatment" className="btn btn-primary">
              Add
            </Link>
          </div>
          <div className="input-group-append">
            <CSVLink data={csvData} filename={"treatment_data.csv"}>
              <CIcon icon={cilCloudDownload} size="lg" />
            </CSVLink>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable responsive="sm">
          <CTableHead>
            <tr>
              <CTableHeaderCell>Patient Name</CTableHeaderCell>
              <CTableHeaderCell>Patient Mobile</CTableHeaderCell>
              <CTableHeaderCell>Doctor Name</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Treatment Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
            </tr>
          </CTableHead>
          <CTableBody>
            {filteredTreatments.map((treatment) => (
              <tr key={treatment.id}>
                <CTableDataCell>{treatment.patient.fullName}</CTableDataCell>
                <CTableDataCell>{treatment.patient.mobile}</CTableDataCell>
                <CTableDataCell>{treatment.doctor.fullName}</CTableDataCell>
                <CTableDataCell>{treatment.description}</CTableDataCell>
                <CTableDataCell>{treatment.treatmentDate}</CTableDataCell>
                <CTableDataCell>{treatment.status}</CTableDataCell>
              </tr>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default Treatment;