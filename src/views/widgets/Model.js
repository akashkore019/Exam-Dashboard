import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <button onClick={onClose} style={closeButtonStyles}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
  maxWidth: "500px",
  width: "100%",
  textAlign: "center",
};

const closeButtonStyles = {
  backgroundColor: "#f00",
  color: "#fff",
  border: "none",
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Modal;
