import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getMaterialDetail, updateMaterial } from "../services/db_manager";

const EditMaterialNote = () => {
    const { materialId } = useParams();
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchMaterialDetail = async () => {
            try {
                const response = await getMaterialDetail(materialId);
                if (response.data) {
                    setForm(response.data);
                }
            } catch (error) {
                console.error("Error fetching material details:", error);
                alert("Error fetching material details.");
            }
        };
        fetchMaterialDetail();
    }, [materialId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateMaterial(materialId, form);
            if (response.status === 200) {
                alert("Material updated successfully!");
                navigate("/materialList");
            }
        } catch (error) {
            console.error("Error updating material:", error);
            alert("Failed to update material.");
        }
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="content">
                <Header />
                <div className="container mt-4">
                    <h5 className="mb-3">Edit Material Note</h5>
                    <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
                        {Object.keys(form).map((key) => (
                            <div className="mb-3" key={key}>
                                <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={key}
                                    value={form[key]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditMaterialNote;
