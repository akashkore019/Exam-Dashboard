import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormLabel,
  CButton,
  CFormTextarea,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { CSVLink } from "react-csv";

import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";

const Treatment = () => {
  const [treatments, setTreatments] = useState([]);
  // here assigned navigate for close modal
  const navigate = useNavigate();

  const formatDateDMY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false); // Add state for search bar visibility
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [medicineNames, setMedicineNames] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: [],
    medicineForms: [],
    medicineName: "",
    medicineId: "",
    dosageName: "",
    durationName: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update CSV data whenever treatments change
    setCSVData([
      [
        "Patient Name",
        "Patient Mobile",
        "Doctor Name",
        "Service Name",
        "Description",
        "Treatment Date",
      ],
      ...treatments.map((treatment) => [
        treatment.patient.fullName,
        treatment.patient.mobile,
        treatment.doctor.fullName,
        treatment.description,
        formatDateDMY(treatment.treatmentDate),
      ]),
    ]);
  }, [treatments]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchServices();
    fetchMedicineNames();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      console.log("Patients response:", response); // Debugging log
      if (response.status === 200) {
        setPatients(response.data);
      } else {
        console.error("Failed to fetch patients. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);
      console.log("Doctors response:", response); // Debugging log
      if (response.status === 200) {
        setDoctors(response.data);
      } else {
        console.error("Failed to fetch doctors. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}service`);
      console.log("Services response:", response); // Debugging log
      if (response.status === 200) {
        setServices(response.data);
      } else {
        console.error("Failed to fetch services. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchMedicineNames = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      if (response.status === 200) {
        const medicineOptions = response.data.map((medicine) => ({
          value: medicine.medicineId,
          label: medicine.medicineName,
        }));

        // alert("HHHHHHHHHH  ___ " + JSON.stringify(medicineOptions));

        setMedicineNames(medicineOptions);
      }
    } catch (error) {
      console.error("Error fetching medicine names:", error);
    }
  };

  useEffect(() => {
    fetchMedicineNames();
  }, []);

  // const [editModeIndex, setEditModeIndex] = useState(null);

  // const handleEditMedicine = (index) => {
  //   const medicineDetailToEdit =
  //     selectedTreatment.treatmentMedicineDetailsList[index];
  //   setTreatment({
  //     ...treatment,
  //     medicineId: medicineDetailToEdit.medicine.medicineId,
  //     medicineName: medicineDetailToEdit.medicine.medicineName,
  //     dosageName: medicineDetailToEdit.dosageInstruction,
  //     durationName: medicineDetailToEdit.duration,
  //   });
  //   setEditModeIndex(index);
  // };

  const handleDeleteMedicine = async (index, medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        // Construct the API endpoint for deleting the medicine
        const apiUrl = `http://localhost:8080/api/v1/treatment/medicine/${medicineId}/${selectedTreatment.id}`;

        // Make the DELETE request
        const response = await axios.delete(apiUrl);

        // Check response status
        if (response.status === 200) {
          toast.success("Medicine deleted successfully!", { autoClose: 3000 });

          // Update the frontend state to reflect deletion
          const updatedDetailsList =
            selectedTreatment.treatmentMedicineDetailsList.filter(
              (med) => med.medicine.medicineId !== medicineId,
            );

          setSelectedTreatment({
            ...selectedTreatment,
            treatmentMedicineDetailsList: updatedDetailsList,
          });

          // Optionally, refetch data or update treatmentsList if necessary
          // fetchData();
          // setTreatmentsList(updatedTreatmentsList);
        } else {
          toast.error("Failed to delete medicine. Please try again.", {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error deleting medicine:", error);
        toast.error("Error deleting medicine. Please try again.", {
          autoClose: 3000,
        });
      }
    }
  };

  const renderMedicineTableRows = () => {
    if (!selectedTreatment || !selectedTreatment.treatmentMedicineDetailsList) {
      return null;
    }

    // Combine the selected treatment medicine details with the new treatments list
    const allMedicineDetails = [
      ...selectedTreatment.treatmentMedicineDetailsList,
      ...treatmentsList.map((item) => ({
        medicine: { medicineName: item.medicineName },
        dosageInstruction: item.dosageInstruction,
        duration: item.duration,
      })),
    ];

    return allMedicineDetails.map((medicineDetail, index) => (
      <CTableRow key={index}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>{medicineDetail.medicine.medicineName}</CTableDataCell>
        <CTableDataCell>{medicineDetail.dosageInstruction}</CTableDataCell>
        <CTableDataCell>{medicineDetail.duration}</CTableDataCell>
        <CTableDataCell>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() =>
              handleDeleteMedicine(index, medicineDetail.medicine.medicineId)
            }
          >
            <FaTrash />
          </CButton>
        </CTableDataCell>
      </CTableRow>
    ));
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    heading: {
      fontSize: 20,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
  });

  const InvoicePDF = ({ formData }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>
          <Text style={styles.text}>Patient: {formData.patientId}</Text>
          <Text style={styles.text}>Doctor: {formData.doctorId}</Text>
          {/* <Text style={styles.text}>Service: {formData.serviceId}</Text> */}
          <Text style={styles.text}>Medicines:</Text>
          {formData.medicineForms.map((medicine, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>
                Medicine {index + 1}: {medicine.medicineId}
              </Text>
              <Text style={styles.text}>Dosage: {medicine.dosage}</Text>
              <Text style={styles.text}>Duration: {medicine.duration}</Text>
            </View>
          ))}
          <Text style={styles.text}>Description: {formData.description}</Text>
        </View>
      </Page>
    </Document>
  );

  useEffect(() => {
    // Filter treatments based on search input
    setFilteredTreatments(
      treatments.filter((treatment) =>
        Object.values(treatment).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase()),
        ),
      ),
    );
  }, [searchInput, treatments]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}treatment`);

      setTreatments(response.data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // Define toggleSearchBar function to toggle search bar visibility
  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  // const handleSearch = () => {
  //   setFilteredTreatments(
  //     treatments.filter((treatment) =>
  //       Object.values(treatment).some((value) =>
  //         String(value).toLowerCase().includes(searchInput.toLowerCase()),
  //       ),
  //     ),
  //   );
  // };

  const handleEdit = (treatmentId) => {
    // alert(JSON.stringify(treatments));
    // console.log(JSON.stringify(treatments));
    const selected = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    // alert("hiiiiii");
    //alert(JSON.stringify(selected));

    //alert(JSON.stringify(selectedTreatment));
    //console.log(JSON.stringify(selectedTreatment));

    setSelectedTreatment(selected);
    setShowEditModal(true); // Open the edit modal
  };

  const handleMedicineChange = (selectedOption) => {
    // alert("hihi   ==   " + JSON.stringify(selectedOption));

    if (selectedOption) {
      setTreatment({
        ...treatment,
        medicineId: selectedOption.value,
        medicineName: selectedOption.label,
      });
    } else {
      // Handle case where selectedOption is null or undefined
      setTreatment({
        ...treatment,
        medicineId: "",
        medicineName: "",
      });
    }
  };

  const [treatmentsList, setTreatmentsList] = useState([]);
  const [dosageOptions] = useState([
    { value: "1:0:0", label: "1:0:0" },
    { value: "1:1:0", label: "1:1:0" },
    { value: "0:1:0", label: "0:1:0" },
    { value: "0:1:1", label: "0:1:1" },
    { value: "1:1:1", label: "1:1:1" },
    { value: "0:0:1", label: "0:0:1" },
    { value: "1:0:1", label: "1:0:1" },
  ]);
  const [durationOptions] = useState([
    { value: "7 days", label: "7 days" },
    { value: "5 days", label: "5 days" },
    { value: "30 days", label: "30 days" },
    { value: "1 day", label: "1 day" },
    { value: "other custom days", label: "Other custom days" },
  ]);

  useEffect(() => {
    fetchMedicines();
  }, []);
  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setMedicine(response.data);
          console.log(response.data);
        } else {
          console.error(
            "Expected an array of medicines, but received:",
            response.data,
          );
        }
      } else {
        console.error("Failed to fetch medicines. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // alert(name + value);
    setTreatment({
      ...treatment,
      [name]: value,
    });
  };

  const handleSubmitMedicine = async (event) => {
    event.preventDefault();

    // Create a new medicine object with the selected medicine details
    const newMedicine = {
      medicineId: treatment.medicineId,
      medicineName: treatment.medicineName,
      dosageInstruction: treatment.dosageName,
      duration: treatment.durationName,
    };

    // alert("hihi   ==   " + JSON.stringify(newMedicine));

    setTreatmentsList([...treatmentsList, newMedicine]);
    // Update the selectedTreatment state with the new medicine
    setSelectedTreatment((prevState) => ({
      ...prevState,
      medicines: Array.isArray(prevState.medicines)
        ? [...prevState.medicines, newMedicine]
        : [newMedicine],
    }));
  };

  // Correct the handleSave function

  const handleSave = async () => {
    try {
      // Check if selectedTreatment is defined
      if (!selectedTreatment) {
        throw new Error("Selected treatment is not defined.");
      }

      // Destructure selectedTreatment for validation
      const {
        patientId,
        doctorId,
        description,
        treatmentItemDetailsList,
        medicines,
      } = selectedTreatment;

      // Validation checks
      if (!patientId || !doctorId) {
        throw new Error("Please select a patient and a doctor.");
      }

      if (!description.trim()) {
        throw new Error("Description cannot be empty.");
      }

      if (treatmentItemDetailsList.length === 0) {
        throw new Error("Please select at least one service.");
      }

      if (medicines.length === 0) {
        throw new Error("Please select at least one medicine.");
      }

      // Construct payload for API request
      const serviceItems = treatmentItemDetailsList.map((item) => ({
        id: item.serviceItem.id,
        serviceName: item.serviceItem.serviceName,
        // Add other necessary fields here if needed
      }));

      const medicinesPayload = medicines.map((medicine) => ({
        medicine: {
          medicineId: medicine.medicineId,
        },
        dosageInstruction: medicine.dosageInstruction,
        duration: medicine.duration,
      }));

      const payload = {
        patientId,
        doctorId,
        description,
        serviceItems,
        medicines: medicinesPayload,
      };

      // Make API call to update treatment
      const res = await axios.put(
        `${config.apiUrl}treatment/${selectedTreatment.id}`,
        payload,
      );

      // Handle response
      if (res.status === 200) {
        // Reset form and state after successful save
        setSelectedTreatment({
          patientId: "",
          doctorId: "",
          treatmentItemDetailsList: [],
          medicines: [],
          description: "",
          // Reset other fields as needed
        });
        setShowEditModal(false);
        toast.success("Treatment data updated successfully!");
        navigate("/treatment"); // Redirect or navigate to the desired page
      } else {
        throw new Error("Failed to update treatment data.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Failed to update treatment data. ${error.message}`);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service from treatment?",
      )
    ) {
      try {
        const apiUrl = `http://localhost:8080/api/v1/treatment/service/${serviceId}/${selectedTreatment.id}`;
        setLoading(true);

        const response = await axios.delete(apiUrl);

        if (response.status === 200) {
          // Remove the deleted service from the state
          const updatedServiceList =
            selectedTreatment.treatmentItemDetailsList.filter(
              (item) => item.serviceItem.id !== serviceId,
            );

          setSelectedTreatment({
            ...selectedTreatment,
            treatmentItemDetailsList: updatedServiceList,
          });

          setLoading(false);
          alert("Service deleted successfully!");
        } else {
          console.error("Failed to delete service:", response.data);
          alert("Failed to delete service. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service. Please try again later.");
      }
    }
  };

  // Inside your functional component
  const handleDelete = async (treatmentId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        // Implement deletion logic here
        await axios.delete(`${config.apiUrl}treatment/${treatmentId}`);
        // Optionally update state or perform other actions upon successful deletion
        fetchData(); // Assuming fetchData is a function to refetch treatments
        toast.success("Patient deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting treatment:", error);
        toast.error("Failed to delete treatment. Please try again.");
      }
    }
  };

  // const renderServiceList = () => {
  //   if (!selectedTreatment || !selectedTreatment.treatmentItemDetailsList) {
  //     return null;
  //   }

  //   return selectedTreatment.treatmentItemDetailsList.map((item) => (
  //     <div key={item.serviceItem.id}>
  //       <span>{item.serviceItem.serviceName}</span>
  //       <button onClick={() => handleEditService(item.serviceItem.id)}>
  //         Edit
  //       </button>
  //       <button onClick={() => handleDeleteService(item.serviceItem.id)}>
  //         Delete
  //       </button>
  //     </div>
  //   ));
  // };

  return (
    <div>
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleSearchBar}
                style={{ marginRight: "10px" }}
              >
                <CIcon icon={cilSearch} />
              </button>
              <div
                className={`input-group ${searchBarVisible ? "" : "d-none"}`}
              >
                <input
                  type="text"
                  placeholder="Search treatment details"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control"
                  style={{ height: "30px", marginRight: "10px" }}
                />
              </div>
              <div
                className="input-group-append"
                style={{ marginRight: "10px" }}
              >
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
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Edit / Delete</th>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Patient Mobile</th>
                <th>Doctor Name</th>
                <th>Description</th>
                <th>Treatment Date</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((treatment) => (
                <tr key={treatment.id}>
                  <td style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(treatment.id)}
                      >
                        <AiFillEdit />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(treatment.id)}
                      >
                        <FaTrash />
                      </CButton>
                    </div>
                  </td>
                  <td>{treatment.id}</td>
                  <td>{treatment.patient.fullName}</td>
                  <td>{treatment.patient.mobile}</td>
                  <td>{treatment.doctor.fullName}</td>
                  <td>{treatment.description}</td>
                  <td>{formatDateDMY(treatment.treatmentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedTreatment && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{
              display: showEditModal ? "block" : "none",
              position: "fixed",
              top: "5%",
              left: "20%",
            }}
          >
            <CCard style={{ width: "800px" }}>
              {/* Adjust the width as needed */}{" "}
              <CCardHeader
                className="modal-header" // Make sure the className matches the handle
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <span style={{ lineHeight: "44px" }}>Update details</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="input-group-append"
                    style={{ marginRight: "10px" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody>
                <CForm
                  className="mb-3 row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={""}
                >
                  <CCol md={4}>
                    <CFormLabel htmlFor="patientId" style={{ color: "#000" }}>
                      Select Patient
                    </CFormLabel>
                    <Select
                      id="patientId"
                      name="patientId"
                      options={
                        Array.isArray(patients)
                          ? patients.map((patient) => ({
                              value: patient.id,
                              label: patient.fullName,
                            }))
                          : []
                      }
                      onChange={(selectedOption) =>
                        setSelectedTreatment((prevTreatment) => ({
                          ...prevTreatment,
                          patientId: selectedOption?.value || "", // Ensure value is set or empty string
                          patient: {
                            id: selectedOption?.value || "",
                            fullName: selectedOption?.label || "",
                            // Include other patient details you need
                          },
                        }))
                      }
                      value={
                        selectedTreatment.patient
                          ? {
                              value: selectedTreatment.patient.id,
                              label: selectedTreatment.patient.fullName,
                            }
                          : null
                      }
                      isClearable
                      // className={
                      //   !selectedTreatment.patientId ? "is-invalid" : ""
                      // }
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                      required
                    />
                    {/* <CFormFeedback invalid>
                      Please select a patient.
                    </CFormFeedback> */}
                  </CCol>

                  {/* Select Doctor */}
                  <CCol md={4}>
                    <CFormLabel htmlFor="doctorId" style={{ color: "#000" }}>
                      Select Doctor
                    </CFormLabel>
                    <Select
                      id="doctorId"
                      name="doctorId"
                      options={
                        Array.isArray(doctors)
                          ? doctors.map((doctor) => ({
                              value: doctor.id,
                              label: doctor.fullName,
                            }))
                          : []
                      }
                      onChange={(selectedOption) =>
                        setSelectedTreatment((prev) => ({
                          ...prev,
                          doctorId: selectedOption?.value || "", // Ensure value is set or empty string
                          doctor: {
                            id: selectedOption?.value || "",
                            fullName: selectedOption?.label || "",
                            // Include other doctor details if needed
                          },
                        }))
                      }
                      value={
                        selectedTreatment.doctor
                          ? {
                              value: selectedTreatment.doctor.id,
                              label: selectedTreatment.doctor.fullName,
                            }
                          : null
                      }
                      isClearable
                      // className={
                      //   !selectedTreatment.doctorId ? "is-invalid" : ""
                      // }
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a doctor.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="serviceId" style={{ color: "#000" }}>
                      Select Service
                    </CFormLabel>
                    <Select
                      id="serviceId"
                      name="serviceId"
                      options={
                        services && services.length > 0
                          ? services.map((service) => ({
                              value: service.id,
                              label: service.serviceName,
                            }))
                          : []
                      }
                      onChange={(selectedOptions) =>
                        setSelectedTreatment((prev) => ({
                          ...prev,
                          treatmentItemDetailsList: selectedOptions.map(
                            (selectedOption) => ({
                              serviceItem: {
                                id: selectedOption.value,
                                serviceName: selectedOption.label,
                              },
                            }),
                          ),
                        }))
                      }
                      isClearable
                      isMulti
                      // className={
                      //   !selectedTreatment.treatmentItemDetailsList.length
                      //     ? "is-invalid"
                      //     : ""
                      // }
                      value={selectedTreatment.treatmentItemDetailsList.map(
                        (item) => ({
                          value: item.serviceItem.id,
                          label: item.serviceItem.serviceName,
                        }),
                      )}
                      required
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                      components={{
                        MultiValueLabel: ({ data }) => (
                          <div>
                            <span>{data.label}</span>
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-danger"
                              onClick={() => handleDeleteService(data.value)}
                              style={{ paddingLeft: "5px" }}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ),
                        MultiValueRemove: () => null, // This will remove the default cross icon
                      }}
                    />

                    <CFormFeedback invalid>
                      Please select a service.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="treatmentDate"
                      style={{ color: "#000" }}
                    >
                      Update Date
                    </CFormLabel>
                    <input
                      id="treatmentDate"
                      type="date"
                      className="form-control"
                      value={selectedTreatment.treatmentDate}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          treatmentDate: e.target.value, // Update selectedTreatment with the entered date
                        })
                      }
                      required
                      style={{ color: "#000", height: "30px" }}
                    />
                    <CFormFeedback invalid>Please enter a date.</CFormFeedback>
                  </CCol>

                  {/* {treatment.medicineForms.map((medicineForms, index) => (
                    <React.Fragment key={index}>medicineName</React.Fragment>
                  ))} */}

                  <CCol md={8}>
                    <CFormLabel htmlFor="description">Description</CFormLabel>
                    <textarea
                      id="description"
                      className="form-control"
                      value={selectedTreatment.description}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          description: e.target.value,
                        })
                      }
                    />
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="medicineName">
                      Select Medicine
                    </CFormLabel>
                    <Select
                      options={
                        Array.isArray(medicineNames) && medicineNames.length > 0
                          ? medicineNames
                          : []
                      }
                      name="medicineId"
                      onChange={handleMedicineChange}
                      required
                    />

                    <CFormFeedback invalid>
                      Please select a medicine.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="dosageName">Select Dosage</CFormLabel>
                    <Select
                      id="dosageName"
                      name="dosageName"
                      options={dosageOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "dosageName",
                            value: selectedOption.value,
                          },
                        })
                      }
                      isClearable
                      placeholder="Select a dosage"
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a Dosage.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="durationName">
                      Select Duration
                    </CFormLabel>
                    <Select
                      id="durationName"
                      name="durationName"
                      options={durationOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "durationName",
                            value: selectedOption.value,
                          },
                        })
                      }
                      isClearable
                      placeholder="Select a duration"
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a duration.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={12}>
                    <CButton color="primary" onClick={handleSubmitMedicine}>
                      Add Medicine
                    </CButton>
                  </CCol>

                  {/* here is the rendered table */}
                  <CCol xs={12}>
                    <CCard>
                      <CCardHeader>Medicine Details</CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Sr.no</CTableHeaderCell>
                              <CTableHeaderCell>Medicine</CTableHeaderCell>
                              <CTableHeaderCell>Dosage</CTableHeaderCell>
                              <CTableHeaderCell>Duration</CTableHeaderCell>
                              <CTableHeaderCell>Delete</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>{renderMedicineTableRows()}</CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CCol md={18}>
                      <button
                        type="button"
                        className="btn btn-primary "
                        onClick={() => handleSave()} // Call handleSave on click
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)} // Close modal on cancel
                      >
                        Cancel
                      </button>
                    </CCol>

                    <div
                      className="input-group-append"
                      style={{ marginRight: "10px" }}
                    >
                      <PDFDownloadLink
                        document={<InvoicePDF formData={treatment} />}
                        fileName="invoice.pdf"
                      >
                        <CButton>
                          <CIcon icon={cilCloudDownload} size="xl" />
                        </CButton>
                      </PDFDownloadLink>
                    </div>
                    <div
                      className="input-group-append"
                      style={{ marginRight: "10px" }}
                    >
                      <CButton onClick={""}>
                        <FaWhatsapp size={25} />
                      </CButton>
                    </div>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Treatment;
