import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilMenu,
  cilMoon,
  cilSun,
} from "@coreui/icons";

import { AppHeaderDropdown } from "./header/index";

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme",
  );

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          "shadow-sm",
          document.documentElement.scrollTop > 0,
        );
    });
  }, []);

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0 bgcolor:#3c8dbc"
      ref={headerRef}
      style={{ backgroundColor: "#3c8dbc" }}
    >
      <CContainer className="border-bottom px-4 color" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: "-14px" }}
        >
          <CIcon icon={cilMenu} size="lg" className="text-white" />
        </CHeaderToggler>
        <CHeaderNav className=" d-flex justify-content-center text-white flex-grow-1">
          <CNavItem>Jhamobi Exam Management Software System</CNavItem>
        </CHeaderNav>

        {/* <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav>
          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li> */}
          <CDropdown
            variant="nav-item"
            placement="bottom-end"
            className="text-white"
          >
            <CDropdownToggle className="text-white" caret={false}>
              {colorMode === "dark" ? (
                <CIcon icon={cilMoon} size="lg" style={{ color: "white" }} />
              ) : colorMode === "auto" ? (
                <CIcon
                  icon={cilContrast}
                  size="lg"
                  style={{ color: "white" }}
                />
              ) : (
                <CIcon icon={cilSun} size="lg" style={{ color: "white" }} />
              )}
            </CDropdownToggle>
            <CDropdownMenu className="text-white">
              <CDropdownItem
                active={colorMode === "light"}
                className="d-flex align-items-center text-white"
                as="button"
                type="button"
                onClick={() => setColorMode("light")}
              >
                <CIcon
                  className="me-2"
                  icon={cilSun}
                  size="lg"
                  style={{ color: "white" }}
                />{" "}
                Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "dark"}
                className="d-flex align-items-center  accordion"
                as="button"
                type="button"
                onClick={() => setColorMode("dark")}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === "auto"}
                className="d-flex align-items-center "
                as="button"
                type="button"
                onClick={() => setColorMode("auto")}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" />
                Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
