// PurchaseOrderForm.js
import { useState, useEffect } from "react";
import styles from "./PurchaseOrderReport.module.css";
import { Save } from "lucide-react";

const PurchaseOrderForm = ({ tableData }) => {
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: "",
    ourReference: "",
    yourReference: "",
    delivery: "",
    deliveryAddress: "",
    paymentTerms: "",
    items: [
      {
        id: 1,
        srNo: 1,
        partNumber: "",
        description: "",
        requiredQty: 0,
        units: "",
        rate: 0,
        gross: 0,
      },
    ],
    pf: 0,
    transportation: 0,
    insurance: 0,
    other_Charges: 0,
    incoterm: "",
    currency: "",
    forwarder: "",
    sgst: "",
    cgst: "",
    igst: "",
    total:"",
    grandTotal:"",
  });

  // Update form when tableData changes
  useEffect(() => {
    if (tableData && Object.keys(tableData).length > 0) {
      // Create an items array with the first item from tableData
      const itemsArray = [
        {
          id: 1,
          srNo: 1,
          partNumber: tableData.partNumber || "",
          description: tableData.description || "",
          requiredQty: tableData.currentStoke || 0,
          units: tableData.unit || "",
          rate: tableData.ratePerUnit || 0,
          gross: tableData.grossAmount || 0,
        },
      ];

      setFormData({
        ...formData,
        poNo: tableData.poNumber || "",
        poDate: tableData.poDate || "",
        ourReference: tableData.ourReference || "",
        yourReference: tableData.yourReference || "",
        delivery: tableData.delivery || "",
        deliveryAddress: tableData.deliveryAddress || "",
        paymentTerms: tableData.paymentTerms || "",
        items: itemsArray,
        incoterm: tableData.incoterm || "",
        currency: tableData.currency || "",
        forwarder: tableData.forwarder || "",
        sgst: tableData.sgst,
        cgst: tableData.cgst,
        igst: tableData.igst,
        total:tableData.total,
        grandTotal:tableData.grandTotal,
        pf: tableData.pf,
        transportation: tableData.transportation,
        insurance: tableData.insurance,
        other_Charges: tableData.other_Charges,

      });
    }
  }, [tableData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    setFormData({ ...formData, [field]: parseFloat(value) || 0 });
  };

  const handleItemChange = (index, field, value) => {
    // Convert value to number if applicable
    let numValue = value;
    if (field === "requiredQty" || field === "rate") {
      numValue = parseFloat(value) || 0;
    }

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: numValue,
    };

    // Recalculate gross if requiredQty or rate changes
    if (field === "requiredQty" || field === "rate") {
      updatedItems[index].gross = calculateGross(
        field === "requiredQty" ? numValue : updatedItems[index].requiredQty,
        field === "rate" ? numValue : updatedItems[index].rate
      );
    }

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9.]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.\-_ ]/g, "");
      event.target.classList.add("is-valid");
    }

    event.target.value = value;
  };

  const handleAddItem = () => {
    const newItem = {
      id: formData.items.length + 1,
      srNo: formData.items.length + 1,
      partNumber: "",
      description: "",
      requiredQty: 0,
      units: "",
      rate: 0,
      gross: 0,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const calculateGross = (qty, rate) => {
    return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.gross || 0), 0);
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() +
      (parseFloat(formData.pf) || 0) +
      (parseFloat(formData.transportation) || 0) +
      (parseFloat(formData.insurance) || 0) +
      (parseFloat(formData.other_Charges) || 0)
    );
  };

  const calculateTax = (rate) => {
    return calculateTotal() * (parseFloat(rate) / 100);
  };

  const calculateGrandTotal = () => {
    const sgstAmount = calculateTax(formData.sgst);
    const cgstAmount = calculateTax(formData.cgst);
    const igstAmount = calculateTax(formData.igst);

    return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
  };

  return (
    <div className={styles.container}>
      <div className={styles.printContainer}>
        <div className={styles.formContainer}>
          {/* Company Section */}
          <div className={styles.companySection}>
            <div className={styles.companyInfo}>
              <div className={styles.companyLogo}>
                <img
                  src="/api/placeholder/100/50"
                  alt="AMC Technology Logo"
                  className={styles.logoImage}
                />
                <div>
                  <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
                  <p className={styles.companyAddress}>
                    105, Hiday Industrial Estate, Hira Industrial Park
                  </p>
                  <p className={styles.companyAddress}>
                    Off Western Express Highway, Vasai Phata,
                  </p>
                  <p className={styles.companyAddress}>
                    Vasai (East) Dist - Palghar, 401208
                  </p>
                  <p className={styles.companyAddress}>
                    GST NO: 27ABTPS4731Z1ZA
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.orderInfoSection}>
              <div className={styles.orderInfoGrid}>
                <div className={styles.orderInfoLabel}>P.O. No.:</div>
                <div>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={formData.poNo}
                    onChange={(e) => {
                      validateDataType(e, "ANS");
                      handleChange("poNo", e.target.value);
                    }}
                  />
                </div>
                <div className={styles.orderInfoLabel}>P.O. Date:</div>
                <div>
                  <input
                    type="date"
                    className={styles.inputField}
                    value={formData.poDate}
                    onChange={(e) => handleChange("poDate", e.target.value)}
                  />
                </div>
                <div className={styles.orderInfoLabel}>Our Reference:</div>
                <div>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={formData.ourReference}
                    onChange={(e) => {
                      validateDataType(e, "ANS");
                      handleChange("ourReference", e.target.value);
                    }}
                  />
                </div>
                <div className={styles.orderInfoLabel}>Your Reference:</div>
                <div>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={formData.yourReference}
                    onChange={(e) => {
                      validateDataType(e, "ANS");
                      handleChange("yourReference", e.target.value);
                    }}
                  />
                </div>
                <div className={styles.orderInfoLabel}>Delivery:</div>
                <div>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={formData.delivery}
                    onChange={(e) => {
                      validateDataType(e, "A");
                      handleChange("delivery", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className={styles.addressSection}>
            <div className={styles.addressBox}>
              <div className={styles.addressContainer}>
                <div className={styles.addressTitle}>To,</div>
                <div className={styles.addressText}>
                  <textarea
                    className={styles.textareaField}
                    value={formData.deliveryAddress}
                    onChange={(e) => {
                      validateDataType(e, "ANS");
                      handleChange("deliveryAddress", e.target.value);
                    }}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <div className={styles.deliveryBox}>
              <div className={styles.addressContainer}>
                <div className={styles.addressTitle}>Delivery Address:</div>
                <div className={styles.addressText}>
                  AMC TECHNOLOGY
                  <br />
                  105, Hiday Industrial Estate, Hira Industrial Park
                  <br />
                  Off Western Express Highway, Vasai Phata,
                  <br />
                  Vasai (East) Dist - Palghar, 401208
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className={styles.paymentTerms}>
            <div className={styles.paymentContainer}>
              <div className={styles.paymentTitle}>Payment Terms:</div>
              <div className={styles.paymentText}>
                <input
                  type="text"
                  className={styles.inputField}
                  value={formData.paymentTerms}
                  onChange={(e) => {
                    validateDataType(e, "ANS");
                    handleChange("paymentTerms", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHead}>
                  <th className={styles.tableHeader}>Sr. No</th>
                  <th className={styles.tableHeader}>Part Number</th>
                  <th className={styles.tableHeader}>Description</th>
                  <th className={styles.tableHeaderCenter}>QTY</th>
                  <th className={styles.tableHeaderCenter}>Units</th>
                  <th className={styles.tableHeaderCenter}>Rate/Unit</th>
                  <th className={styles.tableHeaderCenter}>Gross</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.length > 0 ? (
                  formData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className={styles.tableCell}>{item.srNo}</td>
                      <td className={styles.tableCell}>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={item.partNumber}
                          onChange={(e) => {
                            validateDataType(e, "ANS");
                            handleItemChange(
                              index,
                              "partNumber",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                      <td className={styles.tableCell}>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={item.description}
                          onChange={(e) => {
                            validateDataType(e, "ANS");
                            handleItemChange(
                              index,
                              "description",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                      <td className={styles.tableCellCenter}>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={item.requiredQty}
                          onChange={(e) => {
                            validateDataType(e, "N");
                            handleItemChange(
                              index,
                              "requiredQty",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                      <td className={styles.tableCellCenter}>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={item.units}
                          onChange={(e) => {
                            validateDataType(e, "A");
                            handleItemChange(index, "units", e.target.value);
                          }}
                        />
                      </td>
                      <td className={styles.tableCellCenter}>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={item.rate}
                          onChange={(e) => {
                            validateDataType(e, "N");
                            handleItemChange(index, "rate", e.target.value);
                          }}
                        />
                      </td>
                      <td className={styles.tableCellCenter}>
                        {(item.gross || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No items available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.addButtonContainer}>
              <button className={styles.addButton} onClick={handleAddItem}>
                Add Item
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <div className={styles.footerSection}>
            <div className={styles.footerLeft}>
              <div className={styles.legalText}>
                <div className={styles.legalTitle}>JURISDICTION OF COURTS:</div>
                <p>
                  All contracts shall be deemed to have been wholly made in
                  Mumbai and all claims thereunder are payable in Mumbai City
                  and it is the distinct condition of the order that no suit or
                  action for the purpose of enforcing any claim in respect of
                  the order shall be instituted in any Court other than that
                  situated in Mumbai City, Maharashtra State, India i.e. courts
                  in Mumbai shall alone have jurisdiction to decide upon any
                  dispute arising out of or in Respect of the contract.
                </p>
              </div>
              <div className={styles.termsSection}>
                <div className={styles.termsTitle}>TERMS AND CONDITION:</div>
                <div className={styles.termsGrid}>
                  <div>Incoterm:</div>
                  <div>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={formData.incoterm}
                      onChange={(e) => {
                        validateDataType(e, "ANS");
                        handleChange("incoterm", e.target.value);
                      }}
                    />
                  </div>
                  <div>Currency:</div>
                  <div>
                    <select
                      className={styles.inputField}
                      value={formData.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                    >
                      <option value="">Select Currency</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="EURO">EURO</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                  <div>Forwarder:</div>
                  <div>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={formData.forwarder}
                      onChange={(e) => {
                        validateDataType(e, "A");
                        handleChange("forwarder", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.totalSection}>
              <table className={styles.totalTable}>
                <tbody>
                  <tr>
                    <td className={styles.totalLabel}>Gross</td>
                    <td className={styles.totalValue}>
                      {calculateSubtotal().toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>P&F</td>
                    <td className={styles.totalValue}>
                    {formData.pf}
                      {/* <input
                        type="text"
                        className={styles.inputField}
                        value={formData.pf}
                        onInput={(e) => validateDataType(e, "N")}
                        onChange={(e) =>
                          handleNumberChange("pf", e.target.value)
                        }
                      /> */}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Transportation</td>
                    <td className={styles.totalValue}>
                    {formData.transportation}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Insurance</td>
                    <td className={styles.totalValue}>
                    {formData.insurance}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Other Charges</td>
                    <td className={styles.totalValue}>
                    {formData.other_Charges}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Total</td>
                    <td className={styles.totalValue}>
                      {formData?.total}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>SGST @ 9%</td>
                    <td className={styles.totalValue}>
                      {formData.sgst}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>CGST @ 9%</td>
                    <td className={styles.totalValue}>
                      {formData.cgst}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>IGST @ 18%</td>
                    <td className={styles.totalValue}>
                      {formData.igst}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Grand Total</td>
                    <td className={styles.totalValue}>
                      {formData?.grandTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.signature}>
                <div className={styles.signatureTitle}>FOR AMC TECHNOLOGY</div>
                <div className={styles.signatureSpace}>
                  <div className={styles.signatureTitle}>
                    Authorised Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className={styles.formFooter}>
            <p>Form: AMC-32</p>
            <p>Rev:00</p>
            <p>Date: Jan 2021</p>
          </div>

          {/* Save Button */}
          <div className={styles.saveButtonContainer}>
            <button className={styles.saveButton}>
              <Save size={18} className={styles.saveIcon} />
              Save Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
