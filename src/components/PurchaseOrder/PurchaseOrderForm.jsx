import { useEffect, useState, useRef } from "react";
import { Save } from "lucide-react";
import styles from "./Purchase.module.css";
import {
  createPurchaseOrder,
  fetchSupplierDetails,
} from "../../services/db_manager";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AMCLOGO from "../../static/img/AMCLOGO.jpg";

export default function PurchaseOrderForm() {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const dropdownRef = useRef(null);
  
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: "",
    ourReference: "",
    yourReference: "",
    delivery: "",
    supplierName: "",
    address:
      "AMC TECHNOLOGY 105, Hiday Industrial Estate, Hira Industrial Park Off Western Express Highway, Vasai Phata,Vasai (East) Dist - Palghar, 401208",
    items: [],
    pf: 0,
    transportation: 0,
    insurance: 0,
    other_Charges: 0,
    incoterm: "FOB Mumbai",
    currency: "",
    forwarder: "BlueDart Logistics",
    sgstRate: 0,
    cgstRate: 0,
    igstRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchSupplierDetails();
        if (Array.isArray(response.data)) {
          setData(response.data);
          setFilteredData(response);
        } else {
          setData([]);
          setFilteredData([]);
        }
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load supplier data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    if (!value) {
      setFormData((prevForm) => ({
        ...prevForm,
        supplierName: "",
        deliveryAddress: "",
        paymentTerms: "",
      }));
    }
  };

  const handlePartSelection = (supplier) => {
    setFormData((prevForm) => ({
      ...prevForm,
      supplierName: supplier.supplierName,
      deliveryAddress: supplier.address,
      paymentTerms: supplier.paymentTerms || "",
    }));
    setSearchTerm(supplier.supplierName);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (data.length === 0) return;
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.supplierName
          .trim()
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    }
  }, [selectedItems]);

  const handleItemChange = (index, field, value) => {
    let numValue = value;
    if (field === "requiredQty" || field === "rate") {
      numValue = parseFloat(value) || 0;
      if (field === "requiredQty" && numValue <= 0) return;
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
    let numValue = value === "" ? 0 : parseFloat(value);
    if (numValue < 0) return;
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

  const handleGstRateChange = (field, value) => {
    let numValue = value === "" ? 0 : parseFloat(value);
    if (numValue < 0 || numValue > 100) return;
    setFormData({
      ...formData,
      [field]: numValue,
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
    if (formData.currency === "INR") {
      const sgstAmount = calculateTax(formData.sgstRate);
      const cgstAmount = calculateTax(formData.cgstRate);
      const igstAmount = calculateTax(formData.igstRate);

      return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
    }

    return calculateTotal();
  };

  const handleSave = async () => {
    try {
      if (formData.items.length === 0) {
        toast.error("Please add items to the purchase order.");
        return;
      }

      if (!formData.currency || formData.currency.trim() === "") {
        toast.error("Select Currency");
        return;
      }
      
      if (!formData.deliveryAddress) {
        toast.error("Select delivery address.");
        return;
      }
      
      if (!formData.supplierName || formData.supplierName.trim() === "") {
        toast.error("Please select a supplier.");
        return;
      }

      const itemsWithoutRate = formData.items.filter(
        (item) => !item.rate || item.rate === 0
      );
      if (itemsWithoutRate.length > 0) {
        toast.error("Rate is required for all items.");
        return;
      }

      const firstItem = formData.items[0];

      const sgstAmount =
        formData.currency === "INR" ? calculateTax(formData.sgstRate) : 0;
      const cgstAmount =
        formData.currency === "INR" ? calculateTax(formData.cgstRate) : 0;
      const igstAmount =
        formData.currency === "INR" ? calculateTax(formData.igstRate) : 0;

      const subtotal = calculateSubtotal();
      const total = calculateTotal();
      const grandTotal = calculateGrandTotal();

      const payload = {
        poNumber: "",
        batchNumber: formData.batchNumber,
        poDate: formData.poDate,
        ourReference: formData.ourReference,
        yourReference: formData.yourReference,
        delivery: formData.delivery,
        deliveryAddress: formData.deliveryAddress,
        paymentTerms: formData.paymentTerms,
        supplierName: formData.supplierName,
        ratePerUnit: firstItem.rate,
        grossAmount: subtotal,
        sgst: sgstAmount,
        cgst: cgstAmount,
        igst: igstAmount,
        sgstPercentage:
          formData.currency === "INR" ? parseFloat(formData.sgstRate) || 0 : 0,
        cgstPercentage:
          formData.currency === "INR" ? parseFloat(formData.cgstRate) || 0 : 0,
        igstPercentage:
          formData.currency === "INR" ? parseFloat(formData.igstRate) || 0 : 0,
        total: total,
        grandTotal: grandTotal,
        pf: formData.pf,
        transportation: formData.transportation,
        other_Charges: formData.other_Charges,
        insurance: formData.insurance,
        address: formData.address,
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

      const response = await createPurchaseOrder(payload);
      console.log("Save response:", response);
      if (response.status !== 200) {
        toast.error(
          "Purchase order already saved or Error for saving Purchase Order."
        );
      } else {
        setSearchTerm("");
        setIsDropdownOpen(false);
        toast.success("Purchase Order saved successfully!");
        navigate("/purchaseOrder");
      }
    } catch (error) {
      toast.error(
        "Purchase order already saved or Error for saving Purchase Order."
      );
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      poDate: formattedDate,
    }));
  }, []);

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <div className={styles.mainContent}>
          {/* Breadcrumb Section */}
          <div className={styles.breadcrumbSection}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className={styles.breadcrumbText}>
              <span className={styles.breadcrumbLabel}>Generate Purchase Order</span>
            </div>
          </div>

          {/* Form Container */}
          <div className={styles.container}>
            <div className={styles.formContainer}>
              {/* Company Section */}
              <div className={styles.companySection}>
                <div className={styles.companyInfo}>
                  <div className={styles.companyLogo}>
                    <img
                      src={AMCLOGO}
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
                        disabled
                      />
                    </div>
                    <div className={styles.orderInfoLabel}>Our Reference:</div>
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
                    <div className={styles.orderInfoLabel}>Your Reference:</div>
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
                      {loading ? (
                        <div className={styles.loadingContainer}>
                          <div className={styles.spinner}></div>
                          <span>Loading suppliers...</span>
                        </div>
                      ) : error ? (
                        <div className={styles.errorMessage}>{error}</div>
                      ) : (
                        <div className={styles.dropdownWrapper} ref={dropdownRef}>
                          <textarea
                            className={styles.textareaField}
                            placeholder="Search supplier..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setIsDropdownOpen(true)}
                            required
                            rows={1}
                          />
                          {isDropdownOpen && filteredData.length > 0 && (
                            <div className={styles.dropdown}>
                              {filteredData.map((supplier, index) => (
                                <div
                                  key={index}
                                  className={styles.dropdownItem}
                                  onClick={() => handlePartSelection(supplier)}
                                >
                                  <div className={styles.supplierName}>
                                    {supplier.supplierName}
                                  </div>
                                  <div className={styles.supplierAddress}>
                                    {supplier.address}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={styles.addressText}>
                      <textarea
                        className={styles.textareaField}
                        value={formData.deliveryAddress}
                        required
                        rows={3}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.deliveryBox}>
                  <div className={styles.addressContainer}>
                    <div className={styles.addressTitle}>Delivery Address:</div>
                    <div className={styles.addressText}>
                      <textarea
                        className={styles.textareaField}
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows={5}
                        placeholder="Enter delivery address..."
                      />
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
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.tableHeader}>P_REQ_No</th>
                      <th className={styles.tableHeader}>Part Number</th>
                      <th className={styles.tableHeader}>Description</th>
                      <th className={styles.tableHeaderCenter}>QTY</th>
                      <th className={styles.tableHeaderCenter}>Units</th>
                      <th className={styles.tableHeaderCenter}>Rate/Unit</th>
                      <th className={styles.tableHeaderCenter}>Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.length > 0
                      ? formData.items.map((item, index) => (
                          <tr key={index}>
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
                              {item.units}
                            </td>
                            <td className={styles.tableCellCenter}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                onWheel={(e) => e.target.blur()}
                                className={styles.inputField}
                                value={item.rate === 0 ? "" : item.rate}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "rate",
                                    e.target.value === "" ? 0 : e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={styles.tableCellCenter}>
                              {(item.gross || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      : Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <tr key={index}>
                              <td className={styles.tableCell}>&nbsp;</td>
                              <td className={styles.tableCell}>&nbsp;</td>
                              <td className={styles.tableCell}>&nbsp;</td>
                              <td className={styles.tableCellCenter}>&nbsp;</td>
                              <td className={styles.tableCellCenter}>&nbsp;</td>
                              <td className={styles.tableCellCenter}>&nbsp;</td>
                              <td className={styles.tableCellCenter}>&nbsp;</td>
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
                      All contracts shall be deemed to have been wholly made in
                      Mumbai and all claims thereunder are payable in Mumbai
                      City and it is the distinct condition of the order that no
                      suit or action for the purpose of enforcing any claim in
                      respect of the order shall be instituted in any Court
                      other than that situated in Mumbai City, Maharashtra
                      State, India i.e. courts in Mumbai shall alone have
                      jurisdiction to decide upon any dispute arising out of or
                      in Respect of the contract.
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
                        <td className={styles.totalLabel}>Total</td>
                        <td className={styles.totalValue}>
                          {formData.items.length > 0
                            ? calculateTotal().toFixed(2)
                            : ""}
                        </td>
                      </tr>
                      {formData.currency === "INR" && (
                        <>
                          <tr>
                            <td className={styles.totalLabel}>
                              <span>SGST @ </span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                onWheel={(e) => e.target.blur()}
                                value={
                                  formData.sgstRate === 0 ? "" : formData.sgstRate
                                }
                                onChange={(e) =>
                                  handleGstRateChange(
                                    "sgstRate",
                                    e.target.value === "" ? 0 : e.target.value
                                  )
                                }
                              />
                              <span>%</span>
                            </td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(formData.sgstRate).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>
                              <span>CGST @ </span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                onWheel={(e) => e.target.blur()}
                                value={
                                  formData.cgstRate === 0 ? "" : formData.cgstRate
                                }
                                onChange={(e) =>
                                  handleGstRateChange(
                                    "cgstRate",
                                    e.target.value === "" ? 0 : e.target.value
                                  )
                                }
                              />
                              <span>%</span>
                            </td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(formData.cgstRate).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.totalLabel}>
                              <span>IGST @ </span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                onWheel={(e) => e.target.blur()}
                                value={
                                  formData.igstRate === 0 ? "" : formData.igstRate
                                }
                                onChange={(e) =>
                                  handleGstRateChange(
                                    "igstRate",
                                    e.target.value === "" ? 0 : e.target.value
                                  )
                                }
                              />
                              <span>%</span>
                            </td>
                            <td className={styles.totalValue}>
                              {formData.items.length > 0
                                ? calculateTax(formData.igstRate).toFixed(2)
                                : ""}
                            </td>
                          </tr>
                        </>
                      )}
                      <tr className={styles.grandTotalRow}>
                        <td className={styles.totalLabel}>Grand Total</td>
                        <td className={styles.totalValue}>
                          {formData.items.length > 0
                            ? calculateGrandTotal().toFixed(2)
                            : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className={styles.signatureSection}>
                    <p className={styles.signatureTitle}>FOR AMC TECHNOLOGY</p>
                    <div className={styles.signatureSpace}></div>
                    <p className={styles.signatureTitle}>Authorised Signatory</p>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className={styles.formFooter}>
                <span>Form: AMC-32</span>
                <span>Rev:00</span>
                <span>Date: Jan 2021</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.btnCancel} onClick={() => navigate(-1)}>
                <i className="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                <Save size={18} className={styles.saveIcon} />
                <span>Save Purchase Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}