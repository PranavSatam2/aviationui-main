import React, { useEffect, useState } from "react";
import { Search, Save } from "lucide-react";
import styles from "./Purchase.module.css";
import {
  createPurchaseOrder,
} from "../../services/db_manager";
import Sidebar from "../Sidebar";
import Header from "../Header";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { useLocation , useNavigate } from "react-router-dom"; // <-- For navigation


export default function PurchaseOrderForm() {
const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  console.log("Received selectedItems:", selectedItems);  const [batchNo, setBatchNo] = useState("");
  // State for table data
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: "2025-04-26",
    ourReference: "OR-12345",
    yourReference: "YR-54321",
    delivery: "Immediate",
    deliveryAddress:
      "AMC TECHNOLOGY\n105, Hiday Industrial Estate, Hira Industrial Park\nOff Western Express Highway, Vasai Phata,\nVasai (East) Dist - Palghar, 401208",
    paymentTerms: "Net 30 Days",
    items: [],
    pf: 0,
    transportation: 0,
    insurance: 0,
    other_Charges: 0,
    incoterm: "FOB Mumbai",
    currency: "",
    forwarder: "BlueDart Logistics",
  });

  useEffect(() => {
  if (selectedItems && selectedItems.length > 0) {
    setFormData((prev) => ({
      ...prev,
      items: selectedItems.map((item) => ({
        batchNumber: item.batchNumber,
        id: item.id,
        partNumber: item.partNumber,
        description: item.description,
        requiredQty: item.requiredQty,
        units: item.unitOfMeasurement || "",
        rate: item.rate || 0,
        gross: calculateGross(item.requiredQty, item.rate || 0),
      })),
    }));

    // Optional: If your batch number comes from these items
    //setBatchNo(selectedItems[0].batchNo || "");
  }
}, [selectedItems]);

  const handleItemChange = (index, field, value) => {
    let numValue = value;
    if (field === "requiredQty" || field === "rate") {
      numValue = parseFloat(value) || 0;
      // Only allow positive values
      if (numValue <= 0) return;
    }

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: numValue,
    };

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

  const handleAdditionalChargeChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    // Only allow positive values
    if (numValue <= 0) return;
    setFormData({
      ...formData,
      [field]: numValue,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
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
      formData.pf +
      formData.transportation +
      formData.insurance +
      formData.other_Charges
    );
  };

  const calculateTax = (rate) => {
    return calculateTotal() * (rate / 100);
  };

  const calculateGrandTotal = () => {
    // For this implementation, we'll use the provided tax rates
    // SGST and CGST are both 9%, IGST can be 0% or 18% depending on state
    const sgstAmount = calculateTax(9);
    const cgstAmount = calculateTax(9);
    const igstAmount = 0; // Set to 0 as per the example payload

    return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
  };

  // Search functionality
  const filteredData = tableData.filter((requisition) => {
    return Object.values(requisition).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  // Calculate total items for display
  const totalItems = filteredData.length;

  const handleSave = async () => {
    try {
      // If no items are loaded, show error
      if (formData.items.length === 0) {
        alert("Please search for a Po Number first to load items.");
        return;
      }

      // Use the first item for the unit, rate and gross values
      // as the new API expects single values instead of arrays
      const firstItem = formData.items[0];

      // Prepare the payload according to the new structure
      const payload = {
        // Required fields
        poNumber: "",
         batchNumber: formData.batchNumber,
        // poNumber: formData.poNo,
        poDate: formData.poDate,
        ourReference: formData.ourReference,
        yourReference: formData.yourReference,
        delivery: formData.delivery,
        deliveryAddress: formData.deliveryAddress,
        paymentTerms: formData.paymentTerms,

        // Use the first item's values as per the new API requirements
        //unit: firstItem.units,
        ratePerUnit: firstItem.rate,
        grossAmount: calculateSubtotal(),

        // Taxes & Totals
        sgst: 9.0,
        cgst: 9.0,
        igst: 18.0,
        total: calculateTotal(),
        grandTotal: calculateGrandTotal(),

        // Additional charges - using the new naming convention
        pf: formData.pf,
        transportation: formData.transportation,
        other_Charges: formData.other_Charges,
        insurance: formData.insurance,

        // Other Info
        termsAndConditions:
          "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...",
        incoterm: formData.incoterm,
        currency: formData.currency,
        forwarder: formData.forwarder,

        items: formData.items.map((item) => ({
        batchNumber: item.batchNumber,
        id: item.id,
        partNumber: item.partNumber,
        description: item.description,
        requiredQty: item.requiredQty,
        units: item.units,
        rate: item.rate,
        gross: item.gross,
      })),
      };

      // Call the API to save the data
      const responce = await createPurchaseOrder(payload);
      console.log("Save response:", responce);
      if (responce.status !== 200) {
        toast.error(
          "Purchase order already saved or Error for saving Purchase Order."
        );
      } else {
        toast.success("Purchase Order saved successfully!");
        navigate("/purchaseOrder");

      }
      // alert("Purchase Order saved successfully!");
    } catch (error) {
      toast.error(
        "Purchase order already saved or Error for saving Purchase Order."
      );
    }
  };
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb
              breadcrumbsLabel="Purchase Order"
              // isBack={true}
            />
            <div className={styles.container}>
                <div className={styles.formContainer}>
                  {/* Close button */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Generate Purchase Order  {}</h4>
                  </div>
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
                        <div className={styles.orderInfoLabel}>P.O. Date:</div>
                        <div>
                          <input
                            type="date"
                            className={styles.inputField}
                            value={formData.poDate}
                            onChange={(e) =>
                              handleInputChange("poDate", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>
                          Our Reference:
                        </div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.ourReference}
                            onChange={(e) =>
                              handleInputChange("ourReference", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>
                          Your Reference:
                        </div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.yourReference}
                            onChange={(e) =>
                              handleInputChange("yourReference", e.target.value)
                            }
                          />
                        </div>
                        <div className={styles.orderInfoLabel}>Delivery:</div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.delivery}
                            onChange={(e) =>
                              handleInputChange("delivery", e.target.value)
                            }
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
                            onChange={(e) =>
                              handleInputChange(
                                "deliveryAddress",
                                e.target.value
                              )
                            }
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.deliveryBox}>
                      <div className={styles.addressContainer}>
                        <div className={styles.addressTitle}>
                          Delivery Address:
                        </div>
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
                          onChange={(e) =>
                            handleInputChange("paymentTerms", e.target.value)
                          }
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
                          {/* <th className={styles.tableHeader}>PR_No</th> */}
                          <th className={styles.tableHeader}>P_REQ_No</th>
                          <th className={styles.tableHeader}>Part Number</th>
                          <th className={styles.tableHeader}>Description</th>
                          <th className={styles.tableHeaderCenter}>QTY</th>
                          <th className={styles.tableHeaderCenter}>Units</th>
                          <th className={styles.tableHeaderCenter}>
                            Rate/Unit
                          </th>
                          <th className={styles.tableHeaderCenter}>Gross</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.length > 0
                          ? formData.items.map((item, index) => (
                              <tr key={index}>
                                {/* <td className={styles.tableCell}>{item.batchNumber}</td> */}
                                <td className={styles.tableCell}>{item.id}</td>
                                <td className={styles.tableCell}>
                                  {item.partNumber}
                                </td>
                                <td className={styles.tableCell}>
                                  {item.description}
                                </td>
                                <td className={styles.tableCellCenter}>
                                  {item.requiredQty}
                                </td>
                                <td className={styles.tableCellCenter}>
                                  <input
                                    type="text"
                                    className={styles.inputField}
                                    value={item.units}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "units",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className={styles.tableCellCenter}>
                                  <input
                                    type="number"
                                    min="1"
                                    className={styles.inputField}
                                    value={item.rate}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "rate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className={styles.tableCellCenter}>
                                  {(item.gross || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          : // Empty rows when no items are present
                            Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <tr key={index}>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                  <td className={styles.tableCell}>&nbsp;</td>
                                </tr>
                              ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Section */}
                  <div className={styles.footerSection}>
                    <div className={styles.footerLeft}>
                      <div className={styles.legalText}>
                        <div className={styles.legalTitle}>
                          JURISDICTION OF COURTS:
                        </div>
                        <p>
                          All contracts shall be deemed to have been wholly made
                          in Mumbai and all claims thereunder are payable in
                          Mumbai City and it is the distinct condition of the
                          order that no suit or action for the purpose of
                          enforcing any claim in respect of the order shall be
                          instituted in any Court other than that situated in
                          Mumbai City, Maharashtra State, India i.e. courts in
                          Mumbai shall alone have jurisdiction to decide upon
                          any dispute arising out of or in Respect of the
                          contract.
                        </p>
                      </div>
                      <div className={styles.termsSection}>
                        <div className={styles.termsTitle}>
                          TERMS AND CONDITION:
                        </div>
                        <div className={styles.termsGrid}>
                          <div>Incoterm:</div>
                          <div>
                            <input
                              type="text"
                              className={styles.inputField}
                              value={formData.incoterm}
                              onChange={(e) =>
                                handleInputChange("incoterm", e.target.value)
                              }
                            />
                          </div>
                          <div>Currency:</div>
                          <div>
                            <select
                              className={styles.inputField}
                              value={formData.currency}
                              onChange={(e) =>
                                handleInputChange("currency", e.target.value)
                              }
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
                              onChange={(e) =>
                                handleInputChange("forwarder", e.target.value)
                              }
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
                              {formData.items.length > 0
                                ? calculateSubtotal().toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>P&F</td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                min="1"
                                className={styles.inputField}
                                value={formData.pf}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "pf",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>
                              Transportation
                            </td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                min="1"
                                className={styles.inputField}
                                value={formData.transportation}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "transportation",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Insurance</td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                min="1"
                                className={styles.inputField}
                                value={formData.insurance}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "insurance",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Other Charges</td>
                            <td className={styles.totalValue}>
                              <input
                                type="number"
                                min="1"
                                className={styles.inputField}
                                value={formData.other_Charges}
                                onChange={(e) =>
                                  handleAdditionalChargeChange(
                                    "other_Charges",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Total</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTotal().toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>SGST @ 9%</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(9).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>CGST @ 9%</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(9).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>IGST @ 18%</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(18).toFixed(2)
                                : ""}
                              {/* Set to 0 as per example */}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>Grand Total</td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateGrandTotal().toFixed(2)
                                : ""}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className={styles.signature}>
                        <div className={styles.signatureTitle}>
                          FOR AMC TECHNOLOGY
                        </div>
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
                    <button onClick={handleSave} className={styles.saveButton}>
                      <Save size={18} className={styles.saveIcon} />
                      Save Purchase Order
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
