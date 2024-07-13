import React from "react";
import CIcon from "@coreui/icons-react";
import { AiFillMedicineBox } from "react-icons/ai";

import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import { FaUser, FaCalendarAlt, FaUserMd, FaFileAlt } from "react-icons/fa";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },

  {
    component: CNavItem,
    name: "Question paper",
    to: "/questionpaper",
    icon: <FaFileAlt className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Questions list",
    to: "/patientDetails",
    icon: <FaUser className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Treatment",
    to: "/treatment",
    icon: <FaCalendarAlt className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Doctor",
    to: "/doctor",
    icon: <FaUserMd className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Services",
    to: "/services",
    icon: <FaUserMd className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Medicine Master",
    to: "/medicineMaster",
    icon: <FaUserMd className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Category Master",
    to: "/categoryMaster",
    icon: <AiFillMedicineBox className="nav-icon" />,
  },
];

export default _nav;
