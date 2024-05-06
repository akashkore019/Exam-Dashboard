import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CCol, CFormLabel } from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";


const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter((appointment) =>
        Object.values(appointment).some((value) => {
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
  }, [searchInput, appointments]);

  useEffect(() => {
    // Update CSV data whenever appointments change
    setCSVData(
      appointments.map((appointment) => ({
        "Appointment ID": appointment.appointmentId,
        "Patient Name": appointment.patientName,
        "Patient Mobile": appointment.patientMobile,
        "Appointment Date": appointment.appointmentDate,
        "Appointment Time": appointment.appointmentTime,
        Status: appointment.status,
      })),
    );
  }, [appointments]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}appointment`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleEdit = (appointmentId) => {
    const appointment = appointments.find(
      (appointment) => appointment.appointmentId === appointmentId,
    );
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}appointments/${selectedAppointment.appointmentId}`,
        selectedAppointment,
      );
      setShowEditModal(false);
      fetchData(); // Refresh the table
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating appointment:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`${config.apiUrl}appointments/${appointmentId}`);
        fetchData(); // Refresh the table after deletion
        toast.success("Appointment deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting appointment:", error);
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
        <span style={{ lineHeight: "44px" }}>Appointment Details</span>
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
              placeholder="Search appointment details"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ height: "30px", marginRight: "10px" }}
            />
          </div>
          <div className="input-group-append" style={{ marginRight: "10px" }}>
            <Link to="/addAppointment" className="btn btn-primary">
              Add
            </Link>
          </div>
          <div className="input-group-append" style={{ marginRight: "10px" }}>
            <CSVLink data={csvData} filename={"appointment_data.csv"}>
              <CIcon icon={cilCloudDownload} size="lg" />
            </CSVLink>{" "}
          </div>
        </div>
      </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient Name</th>
                <th>Patient Mobile</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.appointmentId}>
                  <td>{appointment.appointmentId}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.patientMobile}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleEdit(appointment.appointmentId)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(appointment.appointmentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedAppointment && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{ display: showEditModal ? "block" : "none" }}
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
                  Update Appointment Details
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
                    style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}
                  >
                    <CCol md={6}>
                      <CFormLabel htmlFor="patientName">
                        Patient Name
                      </CFormLabel>
                      <input
                        type="text"
                        id="patientName"
                        className="form-control"
                        value={selectedAppointment.patientName}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            patientName: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="patientMobile">
                        Patient Mobile
                      </CFormLabel>
                      <input
                        type="text"
                        id="patientMobile"
                        className="form-control"
                        value={selectedAppointment.patientMobile}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            patientMobile: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="appointmentDate">
                        Appointment Date
                      </CFormLabel>
                      <input
                        type="date"
                        id="appointmentDate"
                        className="form-control"
                        value={selectedAppointment.appointmentDate}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            appointmentDate: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="appointmentTime">
                        Appointment Time
                      </CFormLabel>
                      <input
                        type="time"
                        id="appointmentTime"
                        className="form-control"
                        value={selectedAppointment.appointmentTime}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            appointmentTime: e.target.value,
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="status">Status</CFormLabel>
                      <select
                        id="status"
                        className="form-control"
                        value={selectedAppointment.status}
                        onChange={(e) =>
                          setSelectedAppointment({
                            ...selectedAppointment,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </CCol>
                  </div>
                </div>
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
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Appointment;