import React from "react";
import CIcon from "@coreui/icons-react";
import { AiFillMedicineBox } from "react-icons/ai";
import { cilSpeedometer, cilList, cilPlus, cilNotes } from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";
import { FaFileAlt } from "react-icons/fa";

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
    component: CNavGroup,
    name: "Questions",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Add Question",
        to: "/addQuestions",
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "View Questions",
        to: "/viewQuestions",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Question Paper",
    icon: <FaFileAlt className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Add Question Paper",
        to: "/addQuestionPaper",
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "View Question Paper",
        to: "/viewQuestionPaper",
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
      },
    ],
  },
];

export default _nav;
