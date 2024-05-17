import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config"; // Import the config file
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import Draggable from "react-draggable"; // Import Draggable component
import { toast } from "react-toastify";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CFormLabel,
  CCol,
} from "@coreui/react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    categoryName: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredCategory(
      categories.filter((category) =>
        Object.values(category).some((value) => {
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
  }, [searchInput, categories]);

  useEffect(() => {
    setCSVData(
      categories.map((category) => ({
        id: category.id,
        "Category Name": category.categoryName,
      })),
    );
  }, [categories]);

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}category`);
      setCategories(response.data);
      setCSVData(
        response.data.map((category) => ({
          id: category.id,
          "Category Name": category.categoryName,
        })),
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}category/${selectedCategory.id}`,
        selectedCategory,
      );
      setShowEditModal(false);
      fetchData();
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${config.apiUrl}category/${categoryId}`);
        fetchData();
        toast.success("Category deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    setSelectedCategory(category);
    setShowEditModal(true);
  };

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
          <span style={{ lineHeight: "44px" }}>Category Details</span>
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
              <Link to="/addcategoryMaster" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"category_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <tr>
                <CTableHeaderCell>Edit</CTableHeaderCell>
                <CTableHeaderCell>Delete</CTableHeaderCell>
                <CTableHeaderCell>Category Name</CTableHeaderCell>
              </tr>
            </CTableHead>
            <tbody>
              {filteredCategory.map((category) => (
                <tr key={category.id}>
                  <CTableDataCell onClick={() => handleEdit(category.id)}>
                    <AiFillEdit />
                  </CTableDataCell>
                  <CTableDataCell onClick={() => handleDelete(category.id)}>
                    <FaTrash />
                  </CTableDataCell>
                  <CTableDataCell>{category.categoryName}</CTableDataCell>
                </tr>
              ))}
            </tbody>
          </CTable>
        </CCardBody>
      </CCard>

      {selectedCategory && (
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
                  Update Category Details
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
                    <CCol md={4}>
                      <CFormLabel htmlFor="categoryName">
                        Category Name
                      </CFormLabel>
                      <input
                        type="text"
                        id="categoryName"
                        className="form-control"
                        value={selectedCategory.categoryName}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            categoryName: e.target.value,
                          })
                        }
                      />
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

export default Category;
