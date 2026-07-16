import { useState, useEffect } from "react";
import styles from "./index.module.css";

const MaterialRequisitionForm = ({ tableData }) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      partNumber: "",
      description: "",
      requestedQty: "",
      issuedQty: "",
    },
  ]);

  // Update first row when tableData changes
  useEffect(() => {
    if (tableData && Object.keys(tableData).length > 0) {
      const updatedRows = [...rows];
      updatedRows[0] = {
        ...updatedRows[0],
        partNumber: tableData.partNumber || "",
        description: tableData.description || "",
        requestedQty: tableData.requestedQty || "",
        issuedQty: tableData.issuedQty || "",
      };
      setRows(updatedRows);
    }
  }, [tableData]);

  // Add new row
  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      partNumber: "",
      description: "",
      requestedQty: "",
      issuedQty: "",
    };
    setRows([...rows, newRow]);
  };

  // Handle input change
  const handleRowChange = (id, field, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  return (
    <div className={styles.container}>
      <div className={styles.printContainer}>
        <table className={styles.formTable}>
          <thead>
            {/* Header */}
            <tr>
              <th colSpan="7" className={`${styles.tableCell} ${styles.headerYellow}`}>
                Material Requisition
              </th>
            </tr>

            {/* Requisition No, Date, Current Date */}
            <tr>
              <th className={styles.tableCell}></th>
              <th className={styles.labelCell}>Material Requisition No</th>
              <th className={styles.tableCell}>{tableData?.materialRequisitionNo || ""}</th>
              <th className={styles.labelCell}>Date</th>
              <th className={styles.tableCell}>{tableData?.date || ""}</th>
              <th className={styles.labelCell}>Current Date</th>
              <th className={styles.tableCell}>{tableData?.curDate || ""}</th>
            </tr>

            {/* Workorder No and Supplier
            <tr>
              <th className={styles.tableCell}></th>
              <th className={styles.labelCell}>Workorder No</th>
              <th className={styles.tableCell}>{tableData?.workOrderNo || ""}</th>
            </tr> */}

            {/* Table Columns */}
            <tr>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Sr.No</th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Work Number</th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Part No.</th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Description</th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Requested Qty</th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Issued Qty</th>
              <th className={`${styles.tableCell} ${styles.columnHeader}`}>Supplier Name</th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className={`${styles.tableCell} ${styles.centerText}`}>{row.id}</td>
                <td className={styles.tableCell}>{tableData?.workOrderNo || ""}</td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.partNumber ? (
                    tableData.partNumber
                  ) : (
                    <input
                      type="text"
                      value={row.partNumber}
                      onChange={(e) => handleRowChange(row.id, "partNumber", e.target.value)}
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
                      onChange={(e) => handleRowChange(row.id, "description", e.target.value)}
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
                      onChange={(e) => handleRowChange(row.id, "requestedQty", e.target.value)}
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
                      onChange={(e) => handleRowChange(row.id, "issuedQty", e.target.value)}
                      className={styles.inputField}
                    />
                  )}
                </td>
                <td className={styles.tableCell}>
                  {index === 0 && tableData?.supplierName ? (
                    tableData.supplierName
                  ) : (
                    <input
                      type="text"
                      value={row.supplierName || ""}
                      onChange={(e) => handleRowChange(row.id, "supplierName", e.target.value)}
                      className={styles.inputField}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <div className={styles.signatureRow}>
          <span className={styles.signatureLabel}>Workshop Manager Sign</span>
          <input type="text" className={styles.signatureInput} />
        </div>
      </div>
    </div>
  );
};

export default MaterialRequisitionForm;
