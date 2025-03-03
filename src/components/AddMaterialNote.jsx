import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

// Import only `addMaterialNote` service, since fetch is removed
import { addMaterialNote } from "../services/db_manager";

const MaterialReceiptNoteForm = () => {
    const [form, setForm] = useState({
        mrnNo: '',
        supplierName: '',
        orderNumber: '',
        challanNo: '',
        receiptDate: '',
        partNumber: '',
        partDescription: '',
        quantity: '',
        storeInchargeSign: '',
        qualityAcceptance: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            await addMaterialNote(form);
            alert('Material Receipt Note saved successfully!');
            resetForm();
        } catch (error) {
            console.error('Error saving material:', error);
            alert('Failed to save material receipt note.');
        }
    };

    const resetForm = () => {
        setForm({
            mrnNo: '',
            supplierName: '',
            orderNumber: '',
            challanNo: '',
            receiptDate: '',
            partNumber: '',
            partDescription: '',
            quantity: '',
            storeInchargeSign: '',
            qualityAcceptance: '',
            materialId:''
        });
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="content">
                <Header />

                <div className="col-md-6">
                    <h5 className="mx-3 mt-4">Material Receipt Note Form</h5>
                </div>

                <div className="card border border-dark shadow mx-4 my-4 p-2" style={{ height: 'auto' }}>
                    <form>
                        <div className="col-md-12">
                            <div className="row">
                                {/* MRN No */}
                                <div className="col-md-6 p-2">
                                    <label>MRN No</label>
                                    <input type="text" className="form-control" name="mrnNo" value={form.mrnNo} onChange={handleChange} />
                                </div>

                                {/* Supplier Name */}
                                <div className="col-md-6 p-2">
                                    <label>Supplier Name</label>
                                    <input type="text" className="form-control" name="supplierName" value={form.supplierName} onChange={handleChange} />
                                </div>

                                {/* Order Number */}
                                <div className="col-md-6 p-2">
                                    <label>Order Number</label>
                                    <input type="text" className="form-control" name="orderNumber" value={form.orderNumber} onChange={handleChange} />
                                </div>

                                {/* Challan No */}
                                <div className="col-md-6 p-2">
                                    <label>Challan No</label>
                                    <input type="text" className="form-control" name="challanNo" value={form.challanNo} onChange={handleChange} />
                                </div>

                                {/* Receipt Date */}
                                <div className="col-md-6 p-2">
                                    <label>Receipt Date</label>
                                    <input type="date" className="form-control" name="receiptDate" value={form.receiptDate} onChange={handleChange} />
                                </div>

                                {/* Part Number */}
                                <div className="col-md-6 p-2">
                                    <label>Part Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="partNumber"
                                        value={form.partNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Part Description */}
                                <div className="col-md-6 p-2">
                                    <label>Part Description</label>
                                    <input type="text" className="form-control" name="partDescription" value={form.partDescription} onChange={handleChange} />
                                </div>

                                {/* Quantity */}
                                <div className="col-md-6 p-2">
                                    <label>Quantity</label>
                                    <input type="number" className="form-control" name="quantity" value={form.quantity} onChange={handleChange} />
                                </div>

                                {/* Store Incharge Sign */}
                                <div className="col-md-6 p-2">
                                    <label>Store Incharge Sign</label>
                                    <input type="text" className="form-control" name="storeInchargeSign" value={form.storeInchargeSign} onChange={handleChange} />
                                </div>

                                {/* Quality Acceptance */}
                                <div className="col-md-6 p-2">
                                    <label>Quality Acceptance</label>
                                    <input type="text" className="form-control" name="qualityAcceptance" value={form.qualityAcceptance} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="col-md-12 text-right mt-3">
                            <button type="submit" className="btn btn-primary" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </form>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default MaterialReceiptNoteForm;
