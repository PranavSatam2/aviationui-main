import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import GeneralTab from "./tabs/supplier_registration/GeneralTab";
import IncomingInspectionTab from "./tabs/supplier_registration/IncomingInspectionTab";
import SupplierAnalysisTab from "./tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "./tabs/supplier_registration/QualityProcessTab";
import DocAndProcControl from "./tabs/supplier_registration/DocAndProcControl";
import MaterialAndOther from "./tabs/supplier_registration/MaterialAndOther";
import { createSupplier, updateSupplier } from "../services/db_manager";
import { useLocation } from "react-router-dom";

const SupplierRegistration = () => 
{
    // Variables
    const gmailValidator = !/^[a-zA-Z0-9._%+-]+@gmail\.com$/
    let formVariavles = {supplierName           : '',       phoneNumber     : '',       faxNum              : '',       email                       : '',           address                 : '',           qualityManagerName  : '',    
                        SaleResp                : '',       coreProcess     : '',       workYear            : '',       isoRegistered               : '',           dontKnow                : '',           isoStandard         : '',       
                        registerCar             : '',       numEmp          : '',       numOpeShift         : '',       quaManual                   : '',           turnOver                : '',           independenceManuf   : '', 
                        documentedProcedure     : '',       productShipment : '',       processDocumented   : '',       samplingIncomingInsp        : '',           objectiveEvidence       : '',           carApproval         : '',
                        identificationMaintained: '',       sepInsMaterial  : '',       nonConMaterial      : '',       affectCusReq                : '',           instructionStation      : '',           documentedOperative : '',
                        finalInsAcc             : '',       statisMethod    : '',       suppliedDocument    : '',       includeMethod               : '',           qualityCapabilities     : '',           approvedSupplier    : '',
                        marketPrice             : '',       certifiedReport : '',       supplierCapable     : '',       equipCalibrated             : '',           recalibration           : '',           scopeOfWork         : '',
                        safetyProgram           : '',       houseKeeping    : '',       qmEmail             : '',       qualityManagerPhoneNumber   : '' }

    // ######################################### HOOK #######################################
    const [dataMap, setDataMap] = useState(formVariavles)

    const location                      = useLocation(); // Get location object
    const { supplierId, supplierData }  = location.state || {};  // Access the state passed through navigate

    // ################################## HOOK-FUNCTION ###########################

    // This function is used to save Form data
    async function actionPerformed()
    {
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
                setDataMap(formVariavles)
                window.location.reload();
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


    // ########################### VALIDATION ################################

    // This function validate the dataType
    const validateDataType = (event, dataType) => 
    {
        let value = event.target.value
        if (dataType === 'A') 
        {
            value = value.replace(/[^a-zA-Z0-9 ]/g, '');
        } 
        else if (dataType === 'N') 
        {
            value = value.replace(/[^0-9]/g, '');
        } 
        else if (dataType === 'ANS') 
        {
            value = value.replace(/[^a-zA-Z0-9@.]/g, '');
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
       

    // ############################### RETURN-COMPONENT #############################
    return (
    <div className="wrapper ">
        <Sidebar/>
      
      <div className="content">
        <Header />
          {/* conetnt Begin*/}

            {/* Content heading */}
            <div className="col-md-6">
                <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-4">
                    <h5 className="h5 mx-3 mb-0 text-gray-800">Supplier Registration</h5>
                </div>
            </div>

            {/* Content Body */}
            <div className="card border border-dark shadow mx-4 my-4 p-2" style={{height : '500px'}}>
              <div className="col-md-12">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className="nav-link active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">General</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Quality Analysis</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="contact-tab" data-bs-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Quality Process</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="inspection-tab" data-bs-toggle="tab" href="#inspection" role="tab" aria-controls="inspection" aria-selected="true">Incoming Inspection</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="Doc&Proc-tab" data-bs-toggle="tab" href="#Doc&Proc" role="tab" aria-controls="Doc&Proc" aria-selected="false">Process / Document / Procurement Control</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="Proc&Other-tab" data-bs-toggle="tab" href="#Proc&Other" role="tab" aria-controls="Proc&Other" aria-selected="false">Measuring Equipment & Other</a>
                    </li>
                </ul>
                <div className="tab-content mt-0 border" id="myTabsContent" style={{height : '450px'}}> 
                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">    <GeneralTab             dataMap= {dataMap} handleChange={handleChange} validateDataType = {validateDataType} validateLen = {validateLen}/></div>
                    <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">          <SupplierAnalysisTab    dataMap= {dataMap} handleChange={handleChange} validateDataType = {validateDataType} validateLen = {validateLen}/></div>
                    <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">          <QualityProcessTab      dataMap= {dataMap} handleChange={handleChange} validateDataType = {validateDataType} validateLen = {validateLen}/></div>
                    <div className="tab-pane fade" id="inspection" role="tabpanel" aria-labelledby="inspection-tab">    <IncomingInspectionTab  dataMap= {dataMap} handleChange={handleChange} validateDataType = {validateDataType} validateLen = {validateLen}/></div>
                    <div className="tab-pane fade" id="Doc&Proc" role="tabpanel" aria-labelledby="Doc&Proc-tab">        <DocAndProcControl      dataMap= {dataMap} handleChange={handleChange} validateDataType = {validateDataType} validateLen = {validateLen}/></div>
                    <div className="tab-pane fade" id="Proc&Other" role="tabpanel" aria-labelledby="Proc&Other-tab">    <MaterialAndOther       dataMap= {dataMap} handleChange={handleChange} validateDataType = {validateDataType} validateLen = {validateLen} actionPerformed={actionPerformed}/></div>
                </div>
              </div>
            </div>          
        {/* Content End */}
      <Footer />
      </div>
      
    </div>
    )
}

export default SupplierRegistration;


