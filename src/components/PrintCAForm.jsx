// import { useEffect, useState } from "react";
import styles from "./Checker/CheckerSupplierRegistration/PrintReport.module.css";
import CheckboxWithTick from "./CheckboxWithTick";
import logo from "../static/img/logo.png";

export const PrintCAForm = ({ dataMap }) => {
  console.log("Print",dataMap);
  // Changed from (dataMap) to ({ dataMap })
  return (
    <div  className={styles.container}>
      <div className={styles.printContainer}>
        <div style={{ border: "1px solid black", margin: "1px" }}>
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "30%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              <div style={{ fontWeight: "bold" }}>1. DGCA India</div>
            </div>
            <div
              style={{
                width: "40%",
                textAlign: "center",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "20px",
                borderRight: "1px solid black",
              }}
            >
              2. AUTHORISED RELEASE CERTIFICATE<br></br> CA FORM 1
            </div>
            <div style={{ width: "30%", padding: "10px", fontWeight: "bold" }}>
              3. Form Tracking Number
              <br />
              {dataMap?.formTrackingNumber || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "30%",
                padding: "10px",
              }}
            >
              <div> 4. Approved Organization Name and Address:</div>
              <br />
              <div className={styles.companyLogo}>
                <img
                  src={logo}
                  style={{ height: "50px", width: "50px" }}
                  alt="AMC Technology Logo"
                  className={styles.logoImage}
                />
              </div>
            </div>
            <div
              style={{
                width: "40%",
                textAlign: "left",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              <br />
              AMC TECHNOLOGY
              <br />
              105, HRIDAY INDUSTRIAL ESTATE,
              <br />
              HIRA INDUSTRIAL PARK, VASAI PHATA,
              <br />
              VASAI EAST, PALGHAR 401 203,
              <br />
              MAHARASHTRA, INDIA
            </div>

            <div style={{ width: "30%", padding: "10px" }}>
              5. Work Order/Contract/Invoice:
              <br />
              {dataMap?.workOrderNumber || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "10%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              6. Item
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              7. Description
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              8. Part No.
            </div>
            <div
              style={{
                width: "11%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              9. Qty
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              10. Serial/Batch No.
            </div>
            <div style={{ width: "31%", padding: "10px" }}>11. Status/Work</div>
          </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "10%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              {dataMap?.item || "N/A"}
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              {dataMap?.description || "N/A"}
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              {dataMap?.partNo || "N/A"}
            </div>
            <div
              style={{
                width: "11%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              {dataMap?.quantity || "N/A"}
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              {dataMap?.serialNo || "N/A"}
            </div>
            <div
              style={{
                width: "31%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              {dataMap?.status || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "100%",
                padding: "10px",
              }}
            >
              12. Remarks:
              <br />
              <div style={{ paddingLeft: "60px" }}>
                {dataMap?.remark || "N/A"}
              </div>
            </div>
          </div>

          {/* === Combined Section 13 & 14 === */}
          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
              width: "100%",
            }}
          >
            {/* === Section 13 (with X cross) === */}
            <div
              style={{
                position: "relative",
                flex: 1,
                borderRight: "1px solid black",
                padding: "10px",
                overflow: "hidden",
              }}
            >
              {/* === X Cross Mark using SVG === */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke="black"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1="100%"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="black"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* === Section 13 Text === */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <strong>13. Manufacturer / Conformity Certification</strong>
                <br />
                Certifies that the items identified above were manufactured in
                conformity to:
                <br />
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CheckboxWithTick value={dataMap?.approveDesign13a} />
                  <span>
                    Approved design data and are in condition for safe
                    operation.
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <CheckboxWithTick value={dataMap?.nonApproveDesign13a} />
                  <span>Non-approved design data specified in block 12.</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "15px",
                    gap: "6px",
                    fontSize: "0.9rem",
                  }}
                >
                  <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                    13 b. Authorised Signature
                  </div>
                  <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                    13 c. Approval / Authorisation Number
                  </div>
                  <div style={{ flex: "1 1 calc(50% - 10px)" }}>13 d. Name</div>
                  <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                    13 e. Date (dd/mm/yyyy)
                  </div>
                </div>
              </div>
            </div>

            {/* === Section 14 === */}
            <div
              style={{
                flex: 1,
                padding: "10px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div>
                <strong>14 a. CAR 145.A.50 RELEASE TO SERVICE</strong>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CheckboxWithTick value={dataMap?.otherRegulation14a} />
                  <span>Other regulation specified in block 12.</span>
                </div>
                <br />
                Certifies that unless otherwise specified in block 12, the work
                identified in block 11 and described in block 12 was
                accomplished in accordance with CAR 145 and in respect to that
                work the items are considered ready for release to service.
              </div>

              {/* Signature Fields */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "15px",
                  gap: "6px",
                }}
              >
                <div
                  style={{ flex: "1 1 calc(50% - 10px)", fontSize: "0.9rem" }}
                >
                  14 b. Authorised Signature
                </div>
                <div
                  style={{ flex: "1 1 calc(50% - 10px)", fontSize: "0.9rem" }}
                >
                  14 c. Certificate / Approval Ref No.
                </div>
                <div
                  style={{ flex: "1 1 calc(50% - 10px)", fontSize: "0.9rem" }}
                >
                  14 d. Name
                </div>
                <div
                  style={{ flex: "1 1 calc(50% - 10px)", fontSize: "0.9rem" }}
                >
                  14 e. Date (dd/mm/yyyy)
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div style={{ padding: "10px" }}>
              <div>USER/INSTALLER RESPONSIBILITY:</div>
              <p>
                THIS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE AUTHORITY TO
                INSTALL THE ITEMS. WHERE THE USER/INSTALLER PERFORMS WORK IN
                ACCORDANCE WITH REGULATIONS OF AN AIRWORTHINESS AUTHORITY
                DIFFERENT THAN THE AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1,
                IT IS ESSENTIAL THAT THE USER/INSTALLER ENSURES THAT HIS/HER
                AIRWORTHINESS AUTHORITY ACCEPTS ITEMS FROM THE AIRWORTHINESS
                AUTHORITY SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A
                DO NOT CONSTITUTE INSTALLATION CERTIFICATION. IN ALL CASES
                AIRCRAFT MAINTENANCE RECORDS MUST CONTAIN AN INSTALLATION
                CERTIFICATION ISSUED IN ACCORDANCE WITH THE NATIONAL REGULATIONS
                BY THE USER/INSTALLER BEFORE THE AIRCRAFT MAY BE FLOWN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
