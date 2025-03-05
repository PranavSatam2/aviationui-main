import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import GeneralTab from "./tabs/supplier_registration/GeneralTab";
import SupplierAnalysisTab from "./tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "./tabs/supplier_registration/QualityProcessTab";
import IncomingInspectionTab from "./tabs/supplier_registration/IncomingInspectionTab";
import DocAndProcControl from "./tabs/supplier_registration/DocAndProcControl";
import MaterialAndOther from "./tabs/supplier_registration/MaterialAndOther";
import { createSupplier, updateSupplier } from "../services/db_manager";
import { data, useLocation } from "react-router-dom";

const SupplierRegistration = () => 
{

    // Variables

    const gmailValidator = !/^[a-zA-Z0-9._%+-]+@gmail\.com$/
    let formVariavles = {supplierName           : '',  
        formId               : '',     
        phoneNumber           : '',       
        faxNum                : '',       
        email                 : '',       
        address               : '',       
        qualityManagerName    : '', 
        qualityManagerPhoneNumber  : '',
        qualityManagerEmailId : '',
        saleRepresentativeName :'',
        saleRepresentativeEmailId : '',
        saleRepresentativePhoneNumber :'',    
        coreProcess           : '',       
        workYear              : '',     
        areYouIsoRegistered   : '',
        isoRegistered         : '',       
       //ontKnow              : '',       
        isoStandard           : '',   
        carDgcaApproval       : '',
        isoRegistrationPlans  : '',
      //registerCar           : '',       
        numEmp                : '',       
        numOpeShift           : '',       
        quaManual             : '',       
        turnOver              : '',       
        independenceManuf     : '', 
        documentedOperative   : '',
         documentedProcedure   : '',       
        productShipment       : '',       
        processDocumented     : '',       
        samplingIncomingInsp  : '', 
        receivingInspectionResultsOnFile :'',//ObjectiveEvidence     : '',       
       //arApproval           : '',
        identificationMaintained: '',  
        sepInsMaterial : '',
        nonConMaterial        : '',       
        affectCusReq          : '',   
        writtenWorkInstructionsAvaibleInStation : '',
       //nstructionStation    : '',   
       finalInspectionEvidence : '',
      //documentedOperative   : '',
       //inalInsAcc           : '',       
        statisMethod          : '',       
        suppliedDocument      : '',       
        includeMethod         : '',       
        qualityCapabilities   : '',       
        approvedSupplierList : '',
        marketPrice           : '', 
        certifiedTestReports : '',
    //  certifiedReport       : '',    
        supplierOnTimeDelivery  :'',
     // supplierCapable       : '',       
        equipCalibrated       : '',       
        recalibration         : '',       
        scopeOfWork           : '',
        safetyProgram         : '',       
        houseKeeping          : ''      
         }


    // ######################################### HOOK #######################################

    const [dataMap, setDataMap]         = useState(formVariavles)
    const location                      = useLocation(); 
    const { supplierId, supplierData }  = location.state || {};  
    const [invalidFeedback, setInvalidFeedback] = useState('d-none text-danger ')
    const [invalidFeedbackMsg, setInvalidFeedbackMsg] = useState('')
    let msg = {invalidFld : '*Please enter all mandatory fields', dataSaved : 'Data saved successfully'}

    // ################################## HOOK-FUNCTION ###########################

    // This function is used to save Form data
    async function actionPerformed(action)
    {
        if (action == 'clear')
        {
            debugger
            let keys = Object.keys(formVariavles)
            keys.forEach((key) =>
            {
                formVariavles[key] = ''
            })

            setDataMap(formVariavles)
            return
        }

        let flds = isAllFldValidated()
        
        if ( !flds)
        {
            setInvalidFeedback('text-danger col-md-4')
            return
        }
        else
        {
            setInvalidFeedback('text-danger d-none col-md-4')
        }

        debugger
        if ( supplierId === '' || supplierId == undefined )
        {
            setDataMap(formVariavles)
            let response = await createSupplier(dataMap)
            
            if ( response )
            {
                setDataMap(formVariavles)
                window.location.reload();
            }
        }
        else
        {
            let response = await updateSupplier(supplierId, dataMap)
            if ( response )
            {

                setDataMap(response.data)
                setInvalidFeedbackMsg(msg.dataSaved)
                setInvalidFeedback('text-success col-md-4')
                // window.location.reload();
            }
        }
    }

    // ################################### FUNCTIONS ###############################

    useEffect(() => 
    {
        // Check if supplierData and supplierId are available
        if (supplierData && supplierId) 
        {
            setDataMap((prevData) => (
            {
                ...prevData,
                ...supplierData, // Merge supplierData into dataMap
            }));
        }
    }, [supplierData, supplierId]);


    // This functiom handle all change event's
    const handleChange = (event) => 
    {
        const { name, value } = event.target; 
        setDataMap((dataMap) => (
        {
            ...dataMap,
            [name]: value 
        }));
    };

    // This function validate all mandatory fld are entered
    function isAllFldValidated()
    {
        let flds                = ''
        let keys                = Object.keys(dataMap)
        let isAllFldMandatory = true

        for (let index = 0; index < keys.length; index++) 
        {   
            
            let key = keys[index]
            let value = dataMap[key]

            if ( value === '' )
            {
                if ( key == 'faxNum' || key == 'workYear' || key == 'dontKnow' || key == 'registerCar' || key == 'numEmp' || key == 'numOpeShift')
                {
                    continue
                }
                else
                {   
                    debugger
                    flds += `${key},`
                    isAllFldMandatory = false
                }
            }
        }

        let textFlds = document.querySelectorAll('.is-invalid')

        debugger
        if (textFlds.length >= 1)
        {
            isAllFldMandatory = false
        }

        if (!isAllFldMandatory)
        {   
            setInvalidFeedback('text-danger col-md-4')
            setInvalidFeedbackMsg(msg.invalidFld)
        }
        else
        {
            setInvalidFeedback('d-none text-danger col-md-4')
        }
        
        return isAllFldMandatory
    }




    // ########################### VALIDATION ################################

    // This function validate the dataType
    const validateDataType = (event, dataType) => 
    {
        let value = event.target.value
        if (dataType === 'A') 
        {
            value = value.replace(/[^a-zA-Z0-9 ]/g, '');
            event.target.classList.add('is-valid')
        } 
        else if (dataType === 'N') 
        {
            value = value.replace(/[^0-9]/g, '');
            event.target.classList.add('is-valid')
        } 
        else if (dataType === 'ANS') 
        {
            value = value.replace(/[^a-zA-Z0-9,. ]/g, '');
            event.target.classList.add('is-valid')
        }
    
        event.target.value = value
    };

    // This function validate the length of field
    function validateLen(event, minLen, maxLen) 
    {
        let value = event.target.value.substring(0,maxLen)
        event.target.value = value
        let elementLen = value.length
        if (elementLen > maxLen) 
        {
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
        } 
        else if (elementLen < minLen) 
        {
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
        } 
        else 
        {
            event.target.classList.add('is-valid')
            event.target.classList.remove('is-invalid')
        }
    }
       

    // ############################### RETURN-COMPONENT ############################
    return (
        <div className="wrapper" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
          <Sidebar />
          
          <div className="content" style={{ 
            flex: '1',
            marginLeft: '280px', // Match sidebar width
            backgroundColor: '#f0f6ff' // Light blue background
          }}>
            <Header />
            
            {/* Title Header */}
            <div className="d-flex align-items-center px-4 py-3" style={{ 
              background: 'linear-gradient(to right, #1B74E4, #0D63CF)', 
              color: 'white',
              borderBottom: '1px solid #0b5ed7'
            }}>
              <div>
                <h5 className="fw-semibold mb-1">Supplier Registration</h5>
                <p className="mb-0 opacity-80" style={{ fontSize: '14px' }}>Register and manage supplier information</p>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="main-content-area p-4">
              {/* Content Body */}
              <div className="card border-0 shadow-sm" style={{ 
                borderRadius: '10px', 
                overflow: 'hidden',
                borderTop: '3px solid #1B74E4', // Blue accent top border
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}>
                <div className="card-body p-0">
                  <ul className="nav nav-tabs" id="myTabs" role="tablist" style={{
                    backgroundColor: '#e0ecff', // Light blue tab background
                    padding: '12px 16px 0',
                    border: 'none',
                    borderBottom: '1px solid #c9dcff' // Blue border
                  }}>
                    <li className="nav-item" role="presentation">
                      <a 
                        className="nav-link active px-4 py-2" 
                        id="home-tab" 
                        data-bs-toggle="tab" 
                        href="#home" 
                        role="tab"
                        style={{ 
                          fontWeight: 500,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                          border: '1px solid transparent',
                          backgroundColor: '#fff',
                          color: '#1B74E4', // Blue text for active tab
                          borderBottom: '2px solid #1B74E4' // Blue indicator for active tab
                        }}
                      >
                        General
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a 
                        className="nav-link px-4 py-2" 
                        id="profile-tab" 
                        data-bs-toggle="tab" 
                        href="#profile" 
                        role="tab"
                        style={{ 
                          fontWeight: 500,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                          color: '#495057',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                          e.currentTarget.style.color = '#1B74E4';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        Quality Analysis
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a 
                        className="nav-link px-4 py-2" 
                        id="contact-tab" 
                        data-bs-toggle="tab" 
                        href="#contact" 
                        role="tab"
                        style={{ 
                          fontWeight: 500,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                          color: '#495057',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                          e.currentTarget.style.color = '#1B74E4';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        Quality Process
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a 
                        className="nav-link px-4 py-2" 
                        id="inspection-tab" 
                        data-bs-toggle="tab" 
                        href="#inspection" 
                        role="tab"
                        style={{ 
                          fontWeight: 500,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                          color: '#495057',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                          e.currentTarget.style.color = '#1B74E4';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        Incoming Inspection
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a 
                        className="nav-link px-4 py-2" 
                        id="Doc&Proc-tab" 
                        data-bs-toggle="tab" 
                        href="#Doc&Proc" 
                        role="tab"
                        style={{ 
                          fontWeight: 500,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                          color: '#495057',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                          e.currentTarget.style.color = '#1B74E4';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        Process/Document Control
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a 
                        className="nav-link px-4 py-2" 
                        id="Proc&Other-tab" 
                        data-bs-toggle="tab" 
                        href="#Proc&Other" 
                        role="tab"
                        style={{ 
                          fontWeight: 500,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                          color: '#495057',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                          e.currentTarget.style.color = '#1B74E4';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        Equipment & Other
                      </a>
                    </li>
                  </ul>
                  
                  <div className="tab-content border-0" id="myTabsContent" style={{ 
                    minHeight: '450px',
                    padding: '24px',
                    backgroundColor: 'white'
                  }}>
                    <div className="tab-pane fade show active" id="home" role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-12 mb-3">
                          <h6 className="text-primary mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Supplier Information</h6>
                          <div style={{ height: '1px', backgroundColor: '#e0ecff', marginBottom: '15px' }}></div>
                        </div>
                      </div>
                      <GeneralTab dataMap={dataMap} handleChange={handleChange} validateDataType={validateDataType} validateLen={validateLen} />
                    </div>
                    <div className="tab-pane fade" id="profile" role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-12 mb-3">
                          <h6 className="text-primary mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Quality Analysis</h6>
                          <div style={{ height: '1px', backgroundColor: '#e0ecff', marginBottom: '15px' }}></div>
                        </div>
                      </div>
                      <SupplierAnalysisTab dataMap={dataMap} handleChange={handleChange} validateDataType={validateDataType} validateLen={validateLen} />
                    </div>
                    <div className="tab-pane fade" id="contact" role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-12 mb-3">
                          <h6 className="text-primary mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Quality Process</h6>
                          <div style={{ height: '1px', backgroundColor: '#e0ecff', marginBottom: '15px' }}></div>
                        </div>
                      </div>
                      <QualityProcessTab dataMap={dataMap} handleChange={handleChange} validateDataType={validateDataType} validateLen={validateLen} />
                    </div>
                    <div className="tab-pane fade" id="inspection" role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-12 mb-3">
                          <h6 className="text-primary mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Incoming Inspection</h6>
                          <div style={{ height: '1px', backgroundColor: '#e0ecff', marginBottom: '15px' }}></div>
                        </div>
                      </div>
                      <IncomingInspectionTab dataMap={dataMap} handleChange={handleChange} validateDataType={validateDataType} validateLen={validateLen} />
                    </div>
                    <div className="tab-pane fade" id="Doc&Proc" role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-12 mb-3">
                          <h6 className="text-primary mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Process/Document Control</h6>
                          <div style={{ height: '1px', backgroundColor: '#e0ecff', marginBottom: '15px' }}></div>
                        </div>
                      </div>
                      <DocAndProcControl dataMap={dataMap} handleChange={handleChange} validateDataType={validateDataType} validateLen={validateLen} />
                    </div>
                    <div className="tab-pane fade" id="Proc&Other" role="tabpanel">
                      <div className="row mb-4">
                        <div className="col-12 mb-3">
                          <h6 className="text-primary mb-3" style={{ color: '#1B74E4', fontWeight: '600' }}>Equipment & Other</h6>
                          <div style={{ height: '1px', backgroundColor: '#e0ecff', marginBottom: '15px' }}></div>
                        </div>
                      </div>
                      <MaterialAndOther dataMap={dataMap} handleChange={handleChange} validateDataType={validateDataType} validateLen={validateLen} actionPerformed={actionPerformed} />
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center p-4" style={{ 
                    backgroundColor: '#e0ecff', // Light blue footer
                    borderTop: '1px solid #c9dcff' // Blue border
                  }}>
                    <p className={`${invalidFeedback} mb-0`} style={{ color: '#dc3545' }}>{invalidFeedbackMsg}</p>
                    
                    <div className="d-flex" style={{ gap: '15px' }}>
                      <button 
                        type="button" 
                        className="btn btn-outline-primary px-4 py-2" 
                        onClick={() => actionPerformed('clear')}
                        style={{
                          borderRadius: '6px',
                          borderColor: '#1B74E4',
                          color: '#1B74E4',
                          fontWeight: 500,
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(27, 116, 228, 0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Clear
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary px-4 py-2" 
                        onClick={() => actionPerformed('submit')}
                        style={{
                          borderRadius: '6px',
                          backgroundColor: '#1B74E4',
                          border: 'none',
                          fontWeight: 500,
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
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Footer />
          </div>
        </div>
      );
}

export default SupplierRegistration;


