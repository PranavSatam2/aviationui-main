import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

import GeneralTab from "./tabs/supplier_registration/GeneralTab";
import IncomingInspectionTab from "./tabs/supplier_registration/IncomingInspectionTab";
import SupplierAnalysisTab from "./tabs/supplier_registration/SupplierAnalysisTab";
import QualityProcessTab from "./tabs/supplier_registration/QualityProcessTab";
import SupplierOtherTab from "./tabs/supplier_registration/SupplierOtherTab";




const SupplierRegistration = () => 
{
    // Variables
    const [step, setStep] = useState(1);


    // ################################### FUNCTIONS ###############################

      // Functions to go to next
      const handleNext = () => {
        if (step < 5) setStep(step + 1);
      };

      // Functions to go to previous step
      const handlePrev = () => {
        if (step > 1) setStep(step - 1);
      };

    return (
        <div className="wrapper ">
      <Sidebar />
      
      <div className="content">
      <Header />
        {/* conetnt Begin*/}
        <div className="col-md-6">
            <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
                <h5 className="h5 mx-3 mb-0 text-gray-800">Supplier Registration</h5>
            </div>
        </div>

        <div className="card shadow mx-4 my-2 p-2">
          <div>
          {/* Step 1 */}  
          {step === 1 && (
            <GeneralTab />
          )}

          {/* Step 2 */}
          {step === 2 && (
            <IncomingInspectionTab />
          )}

          {/* Step 3 */}
          {step === 3 && (
            <QualityProcessTab/>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <SupplierAnalysisTab/>
          )}

          {step === 5 && (
            <SupplierOtherTab />
          )}

          {/* Navigation buttons */}
          <div className="text-right">
            {step > 1 && (
              <button className="btn btn-secondary mx-2" onClick={handlePrev}>Previous</button>
            )}
            {step < 5 && (
              <button className="btn btn-primary mx-2" onClick={handleNext}>Next</button>
            )}
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