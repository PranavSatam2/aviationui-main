// MaterialRequisitionForm.js
import { useState, useEffect } from "react";
import styles from "./index.module.css";

const MaterialRequisitionForm = ({ tableData }) => {
  // Initialize rows with the first row containing tableData if available
  const [rows, setRows] = useState([
    {
      id: 1,
      partNo: "",
      description: "",
      requestedQty: "",
      issuedQty: "",
      batchLot: "",
      receivedSign: "",
    }
  ]);

  // Update the form when tableData changes
  useEffect(() => {
    if (tableData && Object.keys(tableData).length > 0) {
      // Update the first row with tableData
      const updatedRows = [...rows];
      updatedRows[0] = {
        ...updatedRows[0],
        partNo: tableData.partNo || "",
        description: tableData.description || "",
        requestedQty: tableData.requestedQty || "",
        issuedQty: tableData.issuedQty || "",
        batchLot: tableData.batchLotNo || "",
      };
      setRows(updatedRows);
    }
  }, [tableData]);

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      partNo: "",
      description: "",
      requestedQty: "",
      issuedQty: "",
      batchLot: "",
      receivedSign: "",
    };
    setRows([...rows, newRow]);
  };

  const handleRowChange = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.printContainer}>
        <table className={styles.formTable}>
          <thead>
            <tr>
              <th
                colSpan="8"
                className={`${styles.tableCell} ${styles.headerYellow}`}
              >
                Material Requisition
              </th>
            </tr>
            <tr>
              <th colSpan="2" className={styles.tableCell}></th>
              <th className={`${styles.tableCell} ${styles.labelCell}`}>
                Material Requisition No
              </th>
              <th className={styles.tableCell}>
                {tableData?.materialRequisitionNo || ""}
              </th>
              <th className={`${styles.tableCell} ${styles.labelCell}`}>
                Date
              </th>
              <th colSpan="3" className={styles.tableCell}>
                {tableData?.date || ""}
              </th>
            </tr>
            <tr>
              <th colSpan="2" className={styles.tableCell}></th>
              <th className={`${styles.tableCell} ${styles.labelCell}`}>
                Workorder No
              </th>
              <th className={styles.tableCell}>
                {tableData?.workOrderNo || ""}
              </th>
              <th colSpan="4" className={styles.tableCell}></th>
            </tr>
            <tr>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Sr.No
              </th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Part No.
              </th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Description
              </th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Requested Qty
              </th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Issued Qty
              </th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Batch/LOT#
              </th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>
                Received Sign
              </th>
              <th className={styles.tableCell}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className={`${styles.tableCell} ${styles.centerText}`}>
                  {row.id}
                </td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.partNo ? (
                    tableData.partNo
                  ) : (
                    <input
                      type="text"
                      value={row.partNo}
                      onChange={(e) =>
                        handleRowChange(row.id, "partNo", e.target.value)
                      }
                      className={styles.inputField}
                    />
                  )}
                </td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.description ? (
                    tableData.description
                  ) : (
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        handleRowChange(row.id, "description", e.target.value)
                      }
                      className={styles.inputField}
                    />
                  )}
                </td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.requestedQty ? (
                    tableData.requestedQty
                  ) : (
                    <input
                      type="text"
                      value={row.requestedQty}
                      onChange={(e) =>
                        handleRowChange(row.id, "requestedQty", e.target.value)
                      }
                      className={styles.inputField}
                    />
                  )}
                </td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.issuedQty ? (
                    tableData.issuedQty
                  ) : (
                    <input
                      type="text"
                      value={row.issuedQty}
                      onChange={(e) =>
                        handleRowChange(row.id, "issuedQty", e.target.value)
                      }
                      className={styles.inputField}
                    />
                  )}
                </td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.batchLotNo ? (
                    tableData.batchLotNo
                  ) : (
                    <input
                      type="text"
                      value={row.batchLot}
                      onChange={(e) =>
                        handleRowChange(row.id, "batchLot", e.target.value)
                      }
                      className={styles.inputField}
                    />
                  )}
                </td>
                <td className={styles.tableCell}>
                  <input
                    type="text"
                    value={row.receivedSign}
                    onChange={(e) =>
                      handleRowChange(row.id, "receivedSign", e.target.value)
                    }
                    className={styles.inputField}
                  />
                </td>
                {/* <td className={styles.tableCell}>
                  {row.id === rows.length && (
                    <div className={styles.addButtonLabel}>
                      Add new
                      <br />
                      Row button
                    </div>
                  )}
                </td> */}
              </tr>
            ))}
            <tr>
              <td className={styles.tableCell}></td>
              <td colSpan="6" className={styles.tableCell}>
                <div className={styles.signatureRow}>
                  <span className={styles.signatureLabel}>
                    Workshop Manager Sign
                  </span>
                  <input type="text" className={styles.signatureInput} />
                </div>
              </td>
              <td className={styles.tableCell}>
                <button onClick={handleAddRow} className={styles.addRowButton}>
                  Add Row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialRequisitionForm;