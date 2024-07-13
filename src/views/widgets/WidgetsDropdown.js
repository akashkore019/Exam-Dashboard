import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowDownLong } from "react-icons/fa6";
import {
  FaQuestionCircle,
  FaFileAlt,
  FaCheckCircle,
  FaPlus,
  FaEye,
} from "react-icons/fa";

const WidgetsDropdown = () => {
  const [data, setData] = useState({
    totalQuestions: 0,
  });

  useEffect(() => {
    axios
      .get(
        "https://internship.jhamobi.com/projects/t001-m001-p001/controller/app_controller.php",
      )
      .then((response) => {
        const count = response.data[0].count;
        setData({
          totalQuestions: count,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <div
          style={{
            backgroundColor: "#00C0EF",
            padding: "20px",
            borderRadius: "5px",
            position: "relative",
            flex: "1",
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#fff" }}>
            {data.totalQuestions}
          </h2>
          <p style={{ color: "#fff" }}>Total Questions</p>
          <p
            style={{
              margin: "0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            More info
            <FaArrowDownLong style={{ marginLeft: "5px" }} />
          </p>
          <FaFileAlt
            style={{
              position: "absolute",
              top: "25px",
              right: "30px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "80px",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#00a65a",
            padding: "20px",
            borderRadius: "5px",
            position: "relative",
            flex: "1",
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#fff" }}>
            {data.totalQuestions}
          </h2>
          <p style={{ color: "#fff" }}>Active Questions</p>
          <p
            style={{
              margin: "0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            More info
            <FaArrowDownLong style={{ marginLeft: "5px" }} />
          </p>
          <FaCheckCircle
            style={{
              position: "absolute",
              top: "25px",
              right: "30px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "80px",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#dd4b39",
            padding: "20px",
            borderRadius: "5px",
            position: "relative",
            flex: "1",
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#fff" }}>
            {data.totalQuestions}
          </h2>
          <p style={{ color: "#fff" }}>Add Questions</p>
          <p
            style={{
              margin: "0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            More info
            <FaArrowDownLong style={{ marginLeft: "5px" }} />
          </p>
          <FaPlus
            style={{
              position: "absolute",
              top: "25px",
              right: "30px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "80px",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", width: "50%" }}>
        <div
          style={{
            backgroundColor: "#0073b7",
            padding: "20px",
            borderRadius: "5px",
            position: "relative",
            flex: "1",
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#fff" }}>
            {data.totalQuestions}
          </h2>
          <p style={{ color: "#fff" }}>Add Question Paper</p>
          <p
            style={{
              margin: "0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            More info
            <FaArrowDownLong style={{ marginLeft: "5px" }} />
          </p>
          <FaFileAlt
            style={{
              position: "absolute",
              top: "25px",
              right: "30px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "80px",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#605ca8",
            padding: "20px",
            borderRadius: "5px",
            position: "relative",
            flex: "1",
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#fff" }}>
            {data.totalQuestions}
          </h2>
          <p style={{ color: "#fff" }}>View Question Paper</p>
          <p
            style={{
              margin: "0",
              color: "#fff",
              display: "flex",
              alignItems: "center",
            }}
          >
            More info
            <FaArrowDownLong style={{ marginLeft: "5px" }} />
          </p>
          <FaEye
            style={{
              position: "absolute",
              top: "25px",
              right: "30px",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "80px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetsDropdown;
