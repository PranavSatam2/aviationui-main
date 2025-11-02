// PurchaseOrderForm.js
import { useState, useEffect } from "react";
import styles from "./PurchaseOrderReport.module.css";
import { Save } from "lucide-react";
import { getPurchaseOrder } from "../../../services/db_manager";
import { toast } from "react-toastify";

const PurchaseOrderForm = ({ tableData, purchaseOrderID }) => {
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
    total: "",
    grandTotal: "",
    cgstPercentage: "",
    igstPercentage: "",
    sgstPercentage: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch purchase order data using API when purchaseOrderID is provided
  const fetchPurchaseOrder = async () => {
    if (!purchaseOrderID) return;

    setIsLoading(true);
    try {
      const response = await getPurchaseOrder(purchaseOrderID);
      if (response) {
        // Create an items array since it's not in the response
        const itemsArray = [
          {
            id: 1,
            srNo: response.srNo || 1,
            partNumber: response.partNumber || "",
            description: response.description || "",
            requiredQty: response.currentStoke || 0,
            units: response.unit || "",
            rate: response.ratePerUnit || 0,
            gross: response.grossAmount || 0,
          },
        ];

        setFormData({
          poNo: response.poNumber || "",
          poDate: response.poDate || "",
          ourReference: response.ourReference || "",
          yourReference: response.yourReference || "",
          delivery: response.delivery || "",
          deliveryAddress: response.deliveryAddress || "",
          paymentTerms: response.paymentTerms || "",
          items: itemsArray,
          incoterm: response.incoterm || "",
          currency: response.currency || "",
          forwarder: response.forwarder || "",
          sgst: response.sgst || 0,
          cgst: response.cgst || 0,
          igst: response.igst || 0,
          total: response.total || 0,
          grandTotal: response.grandTotal || 0,
          pf: response.pf || 0,
          transportation: response.transportation || 0,
          insurance: response.insurance || 0,
          other_Charges: response.other_Charges || 0,
          cgstPercentage: response.cgstPercentage,
          igstPercentage: response.cgstPercentage,
          sgstPercentage: response.cgstPercentage,
        });
      }
    } catch (error) {
      console.error("Error fetching Purchase order details:", error);
      toast.error("Error fetching Purchase order details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when purchaseOrderID changes
  useEffect(() => {
    if (purchaseOrderID) {
      fetchPurchaseOrder();
    }
  }, [purchaseOrderID]);

  // Update form when tableData changes (backward compatibility)
  useEffect(() => {
    // Only use tableData if purchaseOrderID is not provided
    if (!purchaseOrderID && tableData && Object.keys(tableData).length > 0) {
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
        total: tableData.total,
        grandTotal: tableData.grandTotal,
        pf: tableData.pf,
        transportation: tableData.transportation,
        insurance: tableData.insurance,
        other_Charges: tableData.other_Charges,
      });
    }
  }, [tableData, purchaseOrderID]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.printContainer}>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading purchase order...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    readOnly
                  />
                </div>
                <div className={styles.orderInfoLabel}>P.O. Date:</div>
                <div>
                  <input
                    type="date"
                    className={styles.inputField}
                    value={formData.poDate}
                    onChange={(e) => handleChange("poDate", e.target.value)}
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                  readOnly
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
                      <td className={styles.tableCell}>{item.partNumber}</td>
                      <td className={styles.tableCell}>{item.description}</td>
                      <td className={styles.tableCellCenter}>
                        {item.requiredQty}
                      </td>
                      <td className={styles.tableCellCenter}>{item.units}</td>
                      <td className={styles.tableCellCenter}>{item.rate}</td>
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
                      readOnly
                    />
                  </div>
                  <div>Currency:</div>
                  <div>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={formData.currency}
                      readOnly
                    />
                  </div>
                  <div>Forwarder:</div>
                  <div>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={formData.forwarder}
                      readOnly
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
                  {/* <tr>
                    <td className={styles.totalLabel}>P&F</td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.pf) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Transportation</td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.transportation) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Insurance</td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.insurance) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Other Charges</td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.other_Charges) || 0).toFixed(2)}
                    </td>
                  </tr> */}
                  <tr>
                    <td className={styles.totalLabel}>Total</td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.total) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>
                      SGST{formData.sgstPercentage}%
                    </td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.sgst) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>
                      CGST {formData.cgstPercentage}%
                    </td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.cgst) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>
                      IGST {formData.igstPercentage}%
                    </td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.igst) || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.totalLabel}>Grand Total</td>
                    <td className={styles.totalValue}>
                      {(parseFloat(formData.grandTotal) || 0).toFixed(2)}
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
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
