import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const AppointmentDetails = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [csvData, setCSVData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

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
    }
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`${config.apiUrl}appointment/${appointmentId}`);
        setAppointments(appointments.filter(appointment => appointment.appointmentId !== appointmentId));
        toast.success("Appointment deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
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
      <CCardBody>
        <CTable>
          <CTableHead>
            <tr>
              <CTableHeaderCell scope="col">Appointment ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Patient Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Patient Mobile</CTableHeaderCell>
              <CTableHeaderCell scope="col">Appointment Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Appointment Time</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell> {/* Add Actions column */}
            </tr>
          </CTableHead>
          <tbody>
            {appointments
              .filter((appointment) =>
                [
                  "appointmentId",
                  "patientName",
                  "patientMobile",
                  "appointmentDate",
                  "appointmentTime",
                  "status",
                ].some((field) =>
                  String(appointment[field])
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()),
                ),
              )
              .map((appointment) => (
                <tr key={appointment.appointmentId}>
                  <CTableDataCell>{appointment.appointmentId}</CTableDataCell>
                  <CTableDataCell>{appointment.patientName}</CTableDataCell>
                  <CTableDataCell>{appointment.patientMobile}</CTableDataCell>
                  <CTableDataCell>{appointment.appointmentDate}</CTableDataCell>
                  <CTableDataCell>{appointment.appointmentTime}</CTableDataCell>
                  <CTableDataCell>{appointment.status}</CTableDataCell>
                  <CTableDataCell>
                    <Link
                      to={`/editAppointment/${appointment.appointmentId}`} // Link to edit page
                      className="btn btn-primary mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger text-white"
                      onClick={() => handleDelete(appointment.appointmentId)} // Handle Delete action
                    >
                      Delete
                    </button>
                  </CTableDataCell>
                </tr>
              ))}
          </tbody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default AppointmentDetails;