// import { useEffect, useState } from "react";
import styles from "./PrintSupplier.module.css";

export const PrintableGeneralTab = (dataMap) => {
  return (
    <div className={styles.container}>
      <div className={styles.printContainer}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            border: "1px solid black",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              width: "20%",
              padding: "10px",
              borderRight: "1px solid black",
            }}
          >
            <div style={{ fontWeight: "bold" }}>amc</div>
          </div>
          <div
            style={{
              width: "55%",
              textAlign: "center",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              borderRight: "1px solid black",
            }}
          >
            SUPPLIER / SUB-CONTRACTOR EVALUATION FORM
          </div>
          <div style={{ width: "25%", padding: "10px" }}>
            <div>Form: AMC-29</div>
            <div>Rev.: 00</div>
            <div>Date: Jan 2021</div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "20px",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "60%" }}>
              <strong>Supplier Name:</strong>{" "}
              {dataMap["dataMap"]?.supplierName || "N/A"}
            </div>
            <div style={{ width: "40%" }}>
              <strong>Date:</strong>{" "}
              {dataMap["dataMap"]?.date || new Date().toLocaleDateString()}
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Address:</strong> {dataMap["dataMap"]?.address || "N/A"}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "33%" }}>
              <strong>Phone:</strong> {dataMap["dataMap"]?.phoneNumber || "N/A"}
            </div>
            <div style={{ width: "33%" }}>
              <strong>Fax:</strong> {dataMap["dataMap"]?.faxNum || "N/A"}
            </div>
            <div style={{ width: "33%" }}>
              <strong>Email:</strong> {dataMap["dataMap"]?.email || "N/A"}
            </div>
          </div>

          <div
            style={{
              marginBottom: "10px",
              borderTop: "1px solid #ddd",
              paddingTop: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Quality Manager Contact:
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "33%" }}>
                <strong>Name:</strong>{" "}
                {dataMap["dataMap"]?.qualityManagerName || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Phone:</strong>{" "}
                {dataMap["dataMap"]?.qualityManagerPhoneNumber || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Email:</strong>{" "}
                {dataMap["dataMap"]?.qualityManagerEmailId || "N/A"}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Sales Representative Contact:
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "33%" }}>
                <strong>Name:</strong>{" "}
                {dataMap["dataMap"]?.saleRepresentativeName || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Phone:</strong>{" "}
                {dataMap["dataMap"]?.saleRepresentativePhoneNumber || "N/A"}
              </div>
              <div style={{ width: "33%" }}>
                <strong>Email:</strong>{" "}
                {dataMap["dataMap"]?.saleRepresentativeEmailId || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section 1-10 */}
        <div
          style={{
            border: "1px solid black",
            marginBottom: "15px",
          }}
        >
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>1) What are your core products/Process?</strong>
            <div>{dataMap["dataMap"]?.coreProcess || ""}</div>
          </div>
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>
              2) How long have you been in the business doing this type of work?
            </strong>
            <div>{dataMap["dataMap"]?.businessExperience || ""}</div>
          </div>
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
            }}
          >
            <strong>3) Are you ISO registered? - </strong>
            <div>
              {dataMap["dataMap"]?.areYouIsoRegistered === "Yes" ? "Yes" : "No"}
            </div>

            <span style={{ marginLeft: "5px" }}>
              (If yes please include copy of certificate)
            </span>
          </div>
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
            }}
          >
            <div style={{ width: "40%" }}>
              <strong>4) ISO registered</strong>
              <div>{dataMap["dataMap"]?.isoRegistered || ""}</div>
            </div>
            <div style={{ width: "60%" }}>
              <strong>ISO Standard</strong>
              <div>
                {dataMap["dataMap"]?.isoStandard === "Yes" ? "Yes" : "No"}
              </div>
            </div>
          </div>
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>5) Having CAR 145 / DGCA Approval </strong>
            <div>{dataMap["dataMap"]?.carDgcaApproval || ""}</div>
          </div>
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>
              6) If not registered. Do you have plans to do so & when? :-
            </strong>
            <div>{dataMap["dataMap"]?.isoRegistrationPlans || ""}</div>
          </div>
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>7) Total number of employees: -</strong>
            <div>{dataMap["dataMap"]?.numEmp || ""}</div>
          </div>
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>8) Number of operating shifts: -</strong>
            <div>{dataMap["dataMap"]?.numOpeShift || ""}</div>
          </div>
          <div
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
            }}
          >
            <strong>9) Do you have current Quality manual? </strong>
            <div>{dataMap["dataMap"]?.quaManual || ""}</div>
          </div>
          <div style={{ padding: "10px" }}>
            <strong>10) Annual Turnover (In INR)</strong>
            <div>{dataMap["dataMap"]?.turnOver || ""}</div>
          </div>
        </div>

        {/* Quality Process Section */}
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              border: "1px solid black",
              borderBottom: "none",
              padding: "10px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            QUALITY PROCESS
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px",
                    width: "70%",
                    textAlign: "left",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  QMS
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  YES
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  NO
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >
                  N/A
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Does quality assurance have independence from Mfg.?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Do you have documented operative system for internal &external
                  Corrective &preventive actions
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Are there documented procedure for identification, collection,
                  filing, Storage &maintenance of Quality records?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Does your system assure that product shipped meets customers
                  applicable revision of specifications
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Incoming Inspection Section */}
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              border: "1px solid black",
              borderBottom: "none",
              padding: "10px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            Incoming Inspection
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px",
                    width: "70%",
                    textAlign: "left",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                ></th>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  YES
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  NO
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >
                  N/A
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Is incoming process documented?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  What sampling plan is used for incoming inspection?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Is objective evidence of receiving inspection results
                  maintained on file?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Is lot number or other traceability identification maintained?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  {dataMap["dataMap"]?.identificationMaintained==="Yes"?"Yes":""}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >   {dataMap["dataMap"]?.identificationMaintained==="No"?"No":""}</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Is incoming material kept separate from inspected material?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Is there any procedure for isolating nonconforming material?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  Are deviations that affect the customer's requirement referred
                  to customers for disposition?
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                ></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Internal Use Section */}
        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid black",
            paddingTop: "10px",
          }}
        >
          <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
            FOR AMC TECHNOLOGY INTERNAL USE
          </div>
          <div style={{ marginBottom: "10px" }}>
            Approval to vendor (Yes / No): _________________
          </div>
          <div style={{ marginBottom: "20px" }}>
            Remark (If Any): _______________________________
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <div>Quality Manager</div>
            <div>Date: ________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
