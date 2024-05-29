import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
} from "@coreui/react";
import { CSVLink } from "react-csv";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import Draggable from "react-draggable";

import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const Service = () => {
  const [services, setServices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  const [selectedService, setSelectedService] = useState({
    categoryName: "",
    charge: "",
    serviceName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredServices(
      services.filter((service) =>
        Object.values(service).some((value) => {
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
  }, [searchInput, services]);

  useEffect(() => {
    setCSVData(
      services.map((service) => ({
        Id: service.id,
        "Service Name": service.serviceName,
        Charge: service.charge,
        Category: service.categoryName,
      })),
    );
  }, [services]);

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log("Categories:", categories); // Add this line to check categories

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Handle error
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedService({ ...selectedService, [name]: value });
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
    console.log("Editing service with ID:", serviceId);

    const service = services.find((service) => service.id === serviceId);
    if (service) {
      setSelectedService(service);
      setShowEditModal(true);
    } else {
      console.error("Services not found");
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${config.apiUrl}service/${serviceId}`);
        fetchData(); // Refresh the table after deletion
        toast.success("Service deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting service:", error);
        // Handle error - show toast message or any other UI indication
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}service/${selectedService.id}`, // Correct endpoint URL
        selectedService, // Use selectedService instead of selectedPatient
      );
      setShowEditModal(false);
      fetchData(); // Refresh the table
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating service:", error);
      // Handle error - show toast message or any other UI indication
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
              <Link to="/addServices" className="btn btn-primary">
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
                <th>Edit</th>
                <th>Delete</th>
                <th>Id</th>
                <th>Service Name</th>
                <th>Charge</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td onClick={() => handleEdit(service.id)}>
                    <AiFillEdit />
                  </td>
                  <td onClick={() => handleDelete(service.id)}>
                    <FaTrash />
                  </td>
                  <td>{service.id}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.charge}</td>
                  <td>{service.category.categoryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedService && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{
              display: showEditModal ? "block" : "none",
              position: "fixed",
              top: "5%",
              left: "20%",
              right: "20%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CCard
              className="mb-5 "
              style={{ width: "70%", maxHeight: "90vh" }}
            >
              <CCardHeader
                className="modal-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "move",
                }}
              >
                <span>Update Service Details</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </CCardHeader>
              <CCardBody>
                <div className="modal-body" style={{ padding: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CCol md={4}>
                      <CFormLabel htmlFor="serviceName">
                        Service Name
                      </CFormLabel>
                      <input
                        type="text"
                        id="serviceName"
                        className="form-control"
                        value={selectedService.serviceName}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            serviceName: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="charge">Charge</CFormLabel>
                      <input
                        type="number"
                        id="charge"
                        className="form-control"
                        value={selectedService.charge}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            charge: parseFloat(e.target.value),
                          })
                        }
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel htmlFor="categoryId">Category</CFormLabel>
                      <CFormSelect
                        id="categoryId"
                        name="categoryId"
                        value={selectedService.categoryId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormFeedback invalid>
                        Please select a category.
                      </CFormFeedback>
                    </CCol>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Service;
