import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CFormLabel,
  CButton,
} from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { IconContext } from "react-icons";
import { FaPlusCircle } from "react-icons/fa";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    gender: "",
    specialization: "",
    experience: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    qualification: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter((doctor) =>
        Object.values(doctor).some((value) => {
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
  }, [searchInput, doctors]);

  useEffect(() => {
    setCSVData(
      doctors.map((doctor) => ({
        Id: doctor.id,
        "Full Name": doctor.fullName,
        Email: doctor.email,
        "Contact No": doctor.contactNo,
        Gender: doctor.gender,
        Specialization: doctor.specialization,
        Experience: doctor.experience,
        Address: doctor.address,
        Country: doctor.country,
        City: doctor.city,
        "Postal Code": doctor.postalCode,
        Qualification: doctor.qualification,
      })),
    );
  }, [doctors]);

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleEdit = (doctorId) => {
    const doctor = doctors.find((doctor) => doctor.id === doctorId);
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}doctor/${selectedDoctor.id}`,
        selectedDoctor,
      );
      setShowEditModal(false);
      fetchData();
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating doctor:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`${config.apiUrl}doctor/${doctorId}`);
        fetchData();
        toast.success("Doctor deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting doctor:", error);
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
          <span style={{ lineHeight: "44px" }}>Doctor Details</span>
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
                placeholder="Search doctor details"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addDoctor" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"doctor_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Edit / Delete</th>
                <th>Id</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Gender</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Address</th>
                <th>Country</th>
                <th>City</th>
                <th>Postal Code</th>
                <th>Qualification</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doctor.id)}
                      >
                        <AiFillEdit />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doctor.id)}

                      >
                        <FaTrash />
                      </CButton>
                    </div>
                  </td>
                  <td>{doctor.id}</td>
                  <td>{doctor.fullName}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.contactNo}</td>
                  <td>{doctor.gender}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience}</td>
                  <td>{doctor.address}</td>
                  <td>{doctor.country}</td>
                  <td>{doctor.city}</td>
                  <td>{doctor.postalCode}</td>
                  <td>{doctor.qualification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedDoctor && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{
              display: showEditModal ? "block" : "none",
              position: "fixed",
              top: "5%",
              left: "20%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CCard className="mb-5" style={{ width: "70%", maxHeight: "90vh" }}>
              <CCardHeader
                className="modal-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "move",
                }}
              >
                <span style={{ lineHeight: "44px" }}>
                  Update Doctor Details
                </span>
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
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "35px" }}
                  >
                    <CCol md={3}>
                      <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                      <input
                        type="text"
                        id="fullName"
                        className="form-control"
                        value={selectedDoctor.fullName}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="email">Email</CFormLabel>
                      <input
                        type="text"
                        id="email"
                        className="form-control"
                        value={selectedDoctor.email}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            email: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="contactNo">Contact No</CFormLabel>
                      <input
                        type="text"
                        id="contactNo"
                        className="form-control"
                        value={selectedDoctor.contactNo}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            contactNo: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="gender">Gender</CFormLabel>
                      <select
                        id="gender"
                        className="form-control"
                        value={selectedDoctor.gender}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="specialization">
                        Specialization
                      </CFormLabel>
                      <input
                        type="text"
                        id="specialization"
                        className="form-control"
                        value={selectedDoctor.specialization}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            specialization: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="experience">Experience</CFormLabel>
                      <input
                        type="number"
                        id="experience"
                        className="form-control"
                        value={selectedDoctor.experience}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            experience: parseInt(e.target.value),
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="address">Address</CFormLabel>
                      <input
                        type="text"
                        id="address"
                        className="form-control"
                        value={selectedDoctor.address}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            address: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="country">Country</CFormLabel>
                      <input
                        type="text"
                        id="country"
                        className="form-control"
                        value={selectedDoctor.country}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            country: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="city">City</CFormLabel>
                      <input
                        type="text"
                        id="city"
                        className="form-control"
                        value={selectedDoctor.city}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            city: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
                      <input
                        type="text"
                        id="postalCode"
                        className="form-control"
                        value={selectedDoctor.postalCode}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel htmlFor="qualification">
                        Qualification
                      </CFormLabel>
                      <input
                        type="text"
                        id="qualification"
                        className="form-control"
                        value={selectedDoctor.qualification}
                        onChange={(e) =>
                          setSelectedDoctor({
                            ...selectedDoctor,
                            qualification: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    {/* Add other input fields for doctor details */}
                  </div>
                </div>
              </CCardBody>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave()}
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
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Doctor;
