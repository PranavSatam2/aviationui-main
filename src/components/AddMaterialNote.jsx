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
          <div className="content" style={{ marginLeft: '280px' }}>
            <Header />
            
            {/* Title Header */}
            <div className="d-flex align-items-center px-4 py-3" style={{ 
              backgroundColor: '#1B74E4', 
              color: 'white',
              borderBottom: '1px solid #0b5ed7'
            }}>
              <div>
                <h5 className="fw-semibold mb-1">Material Receipt Note Form</h5>
                <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>Create and manage material receipt documentation</p>
              </div>
            </div>
            
            <div className="container-fluid py-3 px-4" style={{ backgroundColor: '#f0f6ff' }}>
              <div className="card border-0 shadow-sm" style={{ 
                borderRadius: '10px', 
                overflow: 'hidden',
                borderTop: '3px solid #1B74E4'
              }}>
                <div className="card-header py-3" style={{ 
                  backgroundColor: '#e0ecff', 
                  borderBottom: '1px solid #c9dcff',
                  borderRadius: '8px 8px 0 0'
                }}>
                  <h6 className="mb-0 text-primary" style={{ color: '#0d6efd', fontWeight: '600' }}>Receipt Information</h6>
                </div>
                
                <div className="card-body p-4">
                  <form>
                    <div className="row">
                      {/* First row */}
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            MRN No
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="mrnNo" 
                            value={form.mrnNo} 
                            onChange={handleChange} 
                            placeholder="Enter MRN number"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Supplier Name
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="supplierName" 
                            value={form.supplierName} 
                            onChange={handleChange} 
                            placeholder="Enter supplier name"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Second row */}
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Order Number
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="orderNumber" 
                            value={form.orderNumber} 
                            onChange={handleChange} 
                            placeholder="Enter order number"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Challan No
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="challanNo" 
                            value={form.challanNo} 
                            onChange={handleChange}
                            placeholder="Enter challan number"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Section divider */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div style={{ 
                          height: '1px', 
                          backgroundColor: '#e0ecff', 
                          margin: '10px 0 20px' 
                        }}></div>
                        <h6 className="mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Item Details</h6>
                      </div>
                    </div>
                    
                    <div className="row">
                      {/* Third row */}
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Receipt Date
                          </label>
                          <input 
                            type="date" 
                            className="form-control border-primary-subtle" 
                            name="receiptDate" 
                            value={form.receiptDate} 
                            onChange={handleChange}
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Part Number
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="partNumber" 
                            value={form.partNumber} 
                            onChange={handleChange}
                            placeholder="Enter part number"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Fourth row */}
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Part Description
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="partDescription" 
                            value={form.partDescription} 
                            onChange={handleChange}
                            placeholder="Enter part description"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Quantity
                          </label>
                          <input 
                            type="number" 
                            className="form-control border-primary-subtle" 
                            name="quantity" 
                            value={form.quantity} 
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Section divider */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div style={{ 
                          height: '1px', 
                          backgroundColor: '#e0ecff', 
                          margin: '10px 0 20px' 
                        }}></div>
                        <h6 className="mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Approval</h6>
                      </div>
                    </div>
                    
                    <div className="row">
                      {/* Fifth row */}
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Store Incharge Sign
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="storeInchargeSign" 
                            value={form.storeInchargeSign} 
                            onChange={handleChange}
                            placeholder="Enter store incharge signature"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Quality Acceptance
                          </label>
                          <input 
                            type="text" 
                            className="form-control border-primary-subtle" 
                            name="qualityAcceptance" 
                            value={form.qualityAcceptance} 
                            onChange={handleChange}
                            placeholder="Enter quality acceptance details"
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-3 pt-3 mt-3" style={{ 
                      borderTop: '1px solid #e0ecff' 
                    }}>
                      <button 
                        type="button" 
                        className="btn btn-outline-primary px-4" 
                        style={{ 
                          borderRadius: '6px',
                          borderColor: '#1B74E4',
                          color: '#1B74E4',
                          fontWeight: '500',
                          padding: '10px 20px',
                          marginRight: '15px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary px-4" 
                        onClick={handleSave}
                        style={{ 
                          borderRadius: '6px',
                          backgroundColor: '#1B74E4',
                          border: 'none',
                          fontWeight: '500',
                          padding: '10px 24px',
                          boxShadow: '0 2px 5px rgba(27, 116, 228, 0.3)',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#0b5ed7';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#1B74E4';
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <Footer />
          </div>
        </div>
      );
};

export default MaterialReceiptNoteForm;
