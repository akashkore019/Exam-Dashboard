import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormLabel,
  CButton,
} from "@coreui/react";

const TreatmentList = () => {
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: "",
    medicineId: "",
  });
  const [medicineForms, setMedicineForms] = useState([]);
  const [medicineNames, setMedicineNames] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchServices();
    fetchMedicineNames();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/patients");
      if (response.status === 200) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/doctor");
      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/service");
      if (response.status === 200) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchMedicineNames = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/medicine");
      if (response.status === 200) {
        setMedicineNames(
          response.data.map((medicine) => ({
            value: medicine.id,
            label: medicine.medicineName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching medicine names:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTreatment({ ...treatment, [name]: value });
  };

  const handleMedicineChange = (selectedOption, index) => {
    if (selectedOption) {
      const selectedMedicineId = selectedOption.value;
      setMedicineForms((prevMedicineForms) => {
        const updatedMedicineForms = [...prevMedicineForms];
        updatedMedicineForms[index] = {
          ...updatedMedicineForms[index],
          medicineId: selectedMedicineId,
        };
        return updatedMedicineForms;
      });
    } else {
      setMedicineForms((prevMedicineForms) => {
        const updatedMedicineForms = [...prevMedicineForms];
        updatedMedicineForms[index] = {
          ...updatedMedicineForms[index],
          medicineId: "",
        };
        return updatedMedicineForms;
      });
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/treatment", {
        ...treatment,
        status: "Scheduled",
      });
      if (res.status === 200) {
        window.alert("Treatment data submitted successfully!");
        form.reset();
        setValidated(false);
        setMedicineForms([]);
      } else {
        throw new Error("Failed to submit treatment data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert(
        "Failed to submit treatment data. Please try again later."
      );
    }
  };

  const handleAddMedicine = () => {
    setMedicineForms([...medicineForms, { medicineId: "" }]);
  };

  return (
    <>
      <CCard className="mb-3">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Add Treatment</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="input-group-append">
              <Link to="/treatment" className="btn btn-primary">
                Back
              </Link>
            </div>
          </div>
        </CCardHeader>{" "}
        <CCardBody>
          <CForm
            className="row g-3 ml needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={4}>
              <CFormLabel htmlFor="patientId">Select Patient</CFormLabel>
              <select
                id="patientId"
                name="patientId"
                className="form-select"
                value={treatment.patientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName}
                  </option>
                ))}
              </select>
              <CFormFeedback invalid>Please select a patient.</CFormFeedback>
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="doctorId">Select Doctor</CFormLabel>
              <select
                id="doctorId"
                name="doctorId"
                className="form-select"
                value={treatment.doctorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
              <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="serviceId">Select Service</CFormLabel>
              <select
                id="serviceId"
                name="serviceId"
                className="form-select"
                value={treatment.serviceId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
              <CFormFeedback invalid>Please select a service.</CFormFeedback>
            </CCol>
            <CCol xs={12}></CCol>
          </CForm>
        </CCardBody>
      </CCard>

      <CButton color="primary" onClick={handleAddMedicine}>
        Add Medicine
      </CButton>

      {/* Medicine Forms */}
      {medicineForms.map((medicineForm, index) => (
        <CCard key={index} className="mb-3">
          <CCardHeader className="flex justify-between items-center">
            <span className="text-lg">Add Medicine</span>
            <button
              type="button"
              className="float-right border-none border-0 bg-transparent text-2xl"
              onClick={() => {
                const updatedMedicineForms = [...medicineForms];
                updatedMedicineForms.splice(index, 1);
                setMedicineForms(updatedMedicineForms);
              }}
            >
              <span aria-hidden="true" className="text-gray-700">
                &times;
              </span>
            </button>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row g-3 ml needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={4}>
                <CFormLabel htmlFor={`medicineId-${index}`}>
                  Search for Medicine
                </CFormLabel>
                <Select
                  id={`medicineId-${index}`}
                  name={`medicineId-${index}`}
                  options={medicineNames}
                  value={
                    medicineForm.medicineId
                      ? medicineNames.find(
                          (medicine) =>
                            medicine.value === parseInt(medicineForm.medicineId)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleMedicineChange(selectedOption, index)
                  }
                  isSearchable
                  placeholder="Select Medicine"
                />

                <CFormFeedback invalid>Please select a medicine.</CFormFeedback>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      ))}
    </>
  );
};

export default TreatmentList;
