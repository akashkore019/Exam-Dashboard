import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CButton } from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import Draggable from "react-draggable"; // Import Draggable component

const Service = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // Mirrors selectedDoctor
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredServices, setFilteredServices] = useState([]); // Mirrors filteredDoctors
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCSVData(
      services.map((service) => ({
        Id: service.id,
        "Service Name": service.serviceName,
        Charge: service.charge,
        Category: service.category.categoryName, // Accessing categoryName property
      })),
    );
  }, [services]);

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}service`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleEdit = (serviceId) => {
    // Redirect to the edit page passing the serviceId
    // You can use react-router-dom's useHistory hook for this
    // Example: history.push(`/editService/${serviceId}`)
    console.log("Edit service:", serviceId);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        alert("Service " + serviceId);

        await axios.delete(`${config.apiUrl}service/${serviceId}`);
        setServices(services.filter((service) => service.id !== serviceId));
        toast.success("Service deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting service:", error);
        // Handle error - show toast message or any other UI indication
      }
    }
  };

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Service Details</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleSearchBar}
              style={{ marginRight: "10px" }}
            >
              <CIcon icon={cilSearch} />
            </button>
            <div className={`input-group ${searchBarVisible ? "" : "d-none"}`}>
              <input
                type="text"
                placeholder="Search service details"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addService" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"service_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Service Name</th>
                <th>Charge</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.charge}</td>
                  <td>{service.category.categoryName}</td>
                  <td>
                    <CButton
                      color="primary"
                      onClick={() => handleEdit(service.id)}
                    >
                      Edit
                    </CButton>
                  </td>
                  <td>
                    <CButton
                      color="danger"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </CButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Service;
