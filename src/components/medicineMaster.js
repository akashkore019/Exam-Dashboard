import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import CIcon from "@coreui/icons-react";
import { cilList, cilPlus, cilSearch } from "@coreui/icons";
import { cilCloudDownload } from "@coreui/icons";
import { CDropdown, CDropdownItem, CDropdownToggle } from "@coreui/react";

const Medicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter((medicine) =>
        Object.values(medicine).some((value) => {
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchInput.toLowerCase())
          ) {
            return true;
          }
          if (
            typeof value === "number" &&
            value.toString().includes(searchInput)
          ) {
            return true;
          }
          return false;
        }),
      ),
    );
  }, [searchInput, medicines]);

  useEffect(() => {
    // Update CSV data whenever filteredMedicines change
    setCSVData(
      filteredMedicines.map((medicine) => ({
        ...medicine,
      })),
    );
  }, [filteredMedicines]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to format date of birth
  const formatDateOfBirth = (dob) => {
    const date = new Date(dob);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Function to toggle search bar visibility
  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Medicine Details</span>
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
                placeholder="Search medicine details"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addMedicineMaster" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"medicine_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>{" "}
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Medicine ID</th>
                <th>Medicine Name</th>
                <th>Medicine Type</th>
                <th>Medicine Contents</th>
                <th>Manufacturer</th>
                <th>Form Type</th>

                <th>Dosage</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td>{medicine.medicineId}</td>
                  <td>{medicine.medicineName}</td>
                  <td>{medicine.medicineType}</td>
                  <td>{medicine.medicineContents}</td>
                  <td>{medicine.manufacturer}</td>
                  <td>{medicine.formType}</td>
                  <td>{medicine.dosage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Medicine;
