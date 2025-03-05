import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { createStore, getStoreDetail, listAllStore, updateStore } from "../services/db_manager";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const StoreAccComponent = () =>
{
    // Variable
    const [form, setForm] = useState({partNum : '', description : '' , batch: '', supplier : '', quantity : '', dom : '', doe : '', dateOfRecipet : '', document : '', nameOfQualityInsp : '', signatureOfQualityInsp : ''})
    const [dropdownItems, setDropdownItems] = useState([])
    const [listData, setListData] = useState('');

    // ######################### FUNCTION ########################

    // This functiom handle all change event's
    const handleChange = (event) => {
        const { name, value } = event.target; 
        setForm((prevData) => ({
            ...prevData,
            [name]: value 
        }));
    };

    // This function set selected part number to input field
    function setSelectedPartNum(event, value)
    {
        setForm((prevData) => ({
            ...prevData,
            partNum: value 
        }));
        handleViewRequest(event, value)
    }

    // ########################## HOOKS ##############################

    // This function is used to send save request
     async function sendSaveRequest()
    {

        debugger
        if(listData.includes(partNum))
        {
            let updateRes = await updateStore(partNum, form)
        }
        else
        {
            let createRes = await createStore(form)
        }
    }

    // This function is used to handle view response
    async function handleViewRequest(event, partNum)
    {
        event.preventDefault(); 
        let response = await getStoreDetail(partNum)
        if (response.data)
        {
            setForm({ ...response.data, });
        }
    }

    // ############################ RETURN ################################
    return (
        <div className="wrapper">
          <Sidebar/>
          
          <div className="content" style={{ marginLeft: '280px' }}>
            <Header />
            
            {/* Title Header */}
            <div className="d-flex align-items-center px-4 py-3" style={{ 
              backgroundColor: '#1B74E4', 
              color: 'white',
              borderBottom: '1px solid #0b5ed7'
            }}>
              <div>
                <h5 className="fw-semibold mb-1">Store Acceptance</h5>
                <p className="mb-0 opacity-75" style={{ fontSize: '14px' }}>Register incoming items for store acceptance</p>
              </div>
            </div>
            
            {/* Content Body */}
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
                  <h6 className="mb-0 text-primary" style={{ color: '#0d6efd', fontWeight: '600' }}>Item Information</h6>
                </div>
                
                <div className="card-body p-4">
                  <form>
                    {/* Part Number section */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="partNum" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Part Number
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="text" 
                            id="partNum" 
                            name="partNum" 
                            placeholder="Enter part number" 
                            value={form.partNum} 
                            onChange={handleChange} 
                            required 
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
                          margin: '0 0 20px' 
                        }}></div>
                      </div>
                    </div>
                    
                    {/* Description and Batch/Lot Number */}
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group">
                          <label htmlFor="description" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Description
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="text" 
                            id="description" 
                            name="description" 
                            placeholder="Enter description" 
                            value={form.description} 
                            onChange={handleChange} 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="batch" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Batch / Lot Number
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="number" 
                            id="batch" 
                            name="batch" 
                            placeholder="Enter batch or lot number" 
                            value={form.batch} 
                            onChange={handleChange} 
                            required 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Condition */}
<div className="row mb-3">
  <div className="col-md-6">
    <div className="form-group">
      <label className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
        Condition
      </label>
      <div className="d-flex align-items-center">
        <div className="form-check me-5" style={{ marginRight: '30px' }}>
          <input 
            className="form-check-input" 
            type="radio" 
            id="conditionNew" 
            name="condition" 
            value="New"
            style={{ 
              borderColor: '#c9dcff'
            }}
          />
          <label className="form-check-label ms-2" htmlFor="conditionNew">New</label>
        </div>
        
        <div className="form-check" style={{ marginRight: '30px' }}>
          <input 
            className="form-check-input" 
            type="radio" 
            id="conditionOW" 
            name="condition" 
            value="0_w"
            style={{ 
              borderColor: '#c9dcff'
            }}
          />
          <label className="form-check-label ms-2" htmlFor="conditionOW">O/W</label>
        </div>
        
        <div className="form-check">
          <input 
            className="form-check-input" 
            type="radio" 
            id="conditionRepaired" 
            name="condition" 
            value="Repaired"
            style={{ 
              borderColor: '#c9dcff'
            }}
          />
          <label className="form-check-label ms-2" htmlFor="conditionRepaired">Repaired</label>
        </div>
      </div>
    </div>
  </div>
</div>
                    
                    {/* Supplier and Quantity */}
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group">
                          <label htmlFor="supplier" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Supplier
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="text" 
                            id="supplier" 
                            name="supplier" 
                            placeholder="Enter supplier name" 
                            value={form.supplier} 
                            onChange={handleChange} 
                            required 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="quantity" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Quantity
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="number" 
                            id="quantity" 
                            name="quantity" 
                            placeholder="Enter quantity" 
                            value={form.quantity} 
                            onChange={handleChange} 
                            required 
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
                    <div className="row mb-4 mt-4">
                      <div className="col-12">
                        <div style={{ 
                          height: '1px', 
                          backgroundColor: '#e0ecff', 
                          margin: '0 0 20px' 
                        }}></div>
                      </div>
                    </div>
                    
                    {/* DOM and DOE */}
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group">
                          <label htmlFor="dom" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            DOM (Date of Manufacture)
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="date" 
                            id="dom" 
                            name="dom" 
                            value={form.dom} 
                            onChange={handleChange} 
                            required 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="doe" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            DOE (Date of Expiry)
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="date" 
                            id="doe" 
                            name="doe" 
                            value={form.doe} 
                            onChange={handleChange} 
                            required 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Inspection Report and Date of Receipt */}
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group">
                          <label htmlFor="document" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Inspection Report
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="file" 
                            id="document" 
                            name="document" 
                            value={form.document} 
                            onChange={handleChange}
                            style={{ 
                              padding: '2px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="dateOfRecipet" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Date of Receipt
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="date" 
                            id="dateOfRecipet" 
                            name="dateOfRecipet" 
                            value={form.dateOfRecipet} 
                            onChange={handleChange} 
                            required 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Quality Inspector and Sign */}
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group">
                          <label htmlFor="nameOfQualityInsp" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Quality Inspector
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="text" 
                            id="nameOfQualityInsp" 
                            name="nameOfQualityInsp" 
                            value={form.nameOfQualityInsp} 
                            onChange={handleChange} 
                            placeholder="Name of Quality Inspector" 
                            required 
                            style={{ 
                              padding: '10px 12px', 
                              borderRadius: '6px',
                              borderColor: '#c9dcff'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="signatureOfQualityInsp" className="form-label fw-medium mb-2" style={{ color: '#1B74E4' }}>
                            Sign
                          </label>
                          <input 
                            className="form-control border-primary-subtle" 
                            type="text" 
                            id="signatureOfQualityInsp" 
                            name="signatureOfQualityInsp" 
                            value={form.signatureOfQualityInsp} 
                            onChange={handleChange} 
                            placeholder="Signature of Quality Inspector" 
                            required 
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
                        type="button" 
                        className="btn btn-primary px-4" 
                        onClick={(event) => sendSaveRequest(event)}
                        style={{ 
                          borderRadius: '6px',
                          backgroundColor: '#1B74E4',
                          border: 'none',
                          fontWeight: '500',
                          padding: '10px 20px',
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
}

export default StoreAccComponent;
