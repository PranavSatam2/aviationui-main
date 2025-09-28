import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { createRepairProduct } from "../services/db_manager"; // create this API
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const AddCustomerRepairProduct = () => {
    const [form, setForm] = useState({
        productName: "",
        productSerialNumbers: [""], // array for dynamic serial numbers
        productDescription: "",
        unitOfMeasurement: "",
        oem: "",
        cmmRefNo: "",
        date: "",
        registerBy: "",
    });

    // Set current date and username on component mount
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        // Get username from session storage
        const username = sessionStorage.getItem('username') || '';
        
        setForm(prev => ({ 
            ...prev, 
            date: formattedDate,
            registerBy: username
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSerialNumberChange = (index, value) => {
        const serials = [...form.productSerialNumbers];
        serials[index] = value;
        setForm({ ...form, productSerialNumbers: serials });
    };

    const addSerialNumber = () => {
        setForm({
            ...form,
            productSerialNumbers: [...form.productSerialNumbers, ""],
        });
    };

    const removeSerialNumber = (index) => {
        const serials = [...form.productSerialNumbers];
        serials.splice(index, 1);
        setForm({ ...form, productSerialNumbers: serials });
    };

    const validateDataType = (event, dataType) => {
        let value = event.target.value;
        if (dataType === "A") {
            value = value.replace(/[^a-zA-Z0-9\s]/g, "");
        } else if (dataType === "N") {
            value = value.replace(/[^0-9]/g, "");
        } else if (dataType === "CMM") {
            // Allow only numeric and dash for CMM Ref No
            value = value.replace(/[^0-9-]/g, "");
        }
        event.target.value = value;
    };


    const validateCMMRefNo = (value) => {
        // CMM Ref No should be numeric OR dash only (examples: 123-456-789, 213123)
        const cmmPattern = /^[0-9-]+$/;
        return cmmPattern.test(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!form.productName || !form.productDescription || !form.unitOfMeasurement || !form.oem || !form.cmmRefNo || !form.date || !form.registerBy) {
            alert("Please fill all required fields.");
            return;
        }

        // CMM Ref No validation
        if (!validateCMMRefNo(form.cmmRefNo)) {
            alert("CMM Ref No should contain only numeric characters and dashes (e.g., 123-456-789 or 213123).");
            return;
        }

        // Optional: check at least one serial number
        if (form.productSerialNumbers.length === 0 || form.productSerialNumbers.some(sn => sn.trim() === "")) {
            alert("Please add at least one valid serial number.");
            return;
        }

        try {
            const response = await createRepairProduct(form);
            console.log("Customer Repair Product added:", response.data);
            alert("Customer Repair Product Added Successfully!");
            // Get current username for reset
            const username = sessionStorage.getItem('username') || '';
            
            setForm({
                productName: "",
                productSerialNumbers: [""],
                productDescription: "",
                unitOfMeasurement: "",
                oem: "",
                cmmRefNo: "",
                date: "",
                registerBy: username,
            });
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        }
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="content">
                <Header />
                <div style={{ marginTop: "10px" }}>
                    <CustomBreadcrumb breadcrumbsLabel="Add Customer Repair Product" isBack={true} />
                    <div className="my-2 p-2">
                        <div className="container-fluid">
                            <div className="row mx-1 card border border-dark shadow-lg py-2">
                                <div className="col-md-12">
                                    <form onSubmit={handleSubmit}>
                                        {/* Product Name */}
                                        <div className="col-md-12 p-2 d-flex">
                                            <label className="col-md-2 mt-2">Product Name</label>
                                            <input
                                                className="form-control w-100"
                                                type="text"
                                                name="productName"
                                                value={form.productName}
                                                onInput={(event) => validateDataType(event, "A")}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Serial Numbers */}
                                        <div className="col-md-12 p-2">
                                            <label className="col-md-2 mt-2">Serial Numbers</label>
                                            {form.productSerialNumbers.map((sn, index) => (
                                                <div key={index} className="d-flex mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={sn}
                                                        onInput={(event) => validateDataType(event, "A")}
                                                        onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                                                        required
                                                    />
                                                    {form.productSerialNumbers.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger ms-2"
                                                            onClick={() => removeSerialNumber(index)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-secondary mt-1" onClick={addSerialNumber}>
                                                Add Serial Number
                                            </button>
                                        </div>

                                        {/* Product Description */}
                                        <div className="col-md-12 p-2 d-flex">
                                            <label className="col-md-2 mt-2">Product Description</label>
                                            <textarea
                                                className="form-control w-100"
                                                name="productDescription"
                                                value={form.productDescription}
                                                onInput={(event) => validateDataType(event, "A")}
                                                onChange={handleChange}
                                                style={{ height: "70px" }}
                                                required
                                            ></textarea>
                                        </div>
                                        {/* UOM & OEM */}
                                        <div className="col-md-12 d-flex">
                                            <div className="col-md-6 p-2 d-flex">
                                                <label className="col-md-4 mt-2">Unit of Measurement</label>
                                                <select
                                                    name="unitOfMeasurement"
                                                    value={form.unitOfMeasurement}
                                                    onChange={handleChange}
                                                    className="form-select"
                                                    required
                                                >
                                                    <option value="">Select Unit</option>
                                                    <option value="EA">EA</option>
                                                    <option value="RL">RL</option>
                                                    <option value="QT">QT</option>
                                                    <option value="GAL">GAL</option>
                                                    <option value="KIT">KIT</option>
                                                    <option value="LTR">LTR</option>
                                                    <option value="SHT">SHT</option>
                                                    <option value="Sq.ft">Sq.ft</option>
                                                    <option value="Sq.mtr">Sq.mtr</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 p-2 d-flex">
                                                <label className="col-md-4 mt-2">OEM</label>
                                                <input
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="oem"
                                                    value={form.oem}
                                                    onInput={(event) => validateDataType(event, "A")}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* CMM Ref No & Date */}
                                        <div className="col-md-12 d-flex">
                                            <div className="col-md-6 p-2 d-flex">
                                                <label className="col-md-4 mt-2">CMM Ref No</label>
                                                <input
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="cmmRefNo"
                                                    value={form.cmmRefNo}
                                                    onInput={(event) => validateDataType(event, "CMM")}
                                                    onChange={handleChange}
                                                    placeholder="e.g., 123-456-789 or 213123"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 p-2 d-flex">
                                                <label className="col-md-4 mt-2">Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control w-100"
                                                    name="date"
                                                    value={form.date}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Registered By */}
                                        <div className="col-md-12 d-flex">
                                            <div className="col-md-6 p-2 d-flex">
                                                <label className="col-md-4 mt-2">Registered By</label>
                                                <input
                                                    type="text"
                                                    className="form-control w-100"
                                                    name="registerBy"
                                                    value={form.registerBy}
                                                    disabled
                                                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <div className="col-md-12 text-end m-1 p-4">
                                            <button type="submit" className="btn btn-primary">
                                                Add Customer Repair Product
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddCustomerRepairProduct;
