import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import { AppSidebarNav } from "./AppSidebarNav";
import navigation from "../_nav";
import jm_logo from "../assets/jm_logo.png";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
      style={{ backgroundColor: "#222d32" }}  // Applying #222d32 color to the sidebar
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          to="/"
          className="sidebar-brand"
          style={{
            textDecoration: "none",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link to="./dashboard">
            <img
              src={jm_logo} // Use the imported logo
              alt="Logo"
              style={{ height: "32px", marginRight: "8px" }}
            />
          </Link>
          <Link
            to="./dashboard"
            style={{
              textDecoration: "none", // Remove underline
              color: "inherit", // Inherit color from parent or set to specific color
            }}
          >
            <h4 style={{ margin: 0 }}>Admin</h4>
          </Link>
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
