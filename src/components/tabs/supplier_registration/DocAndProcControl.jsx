

const DocAndProcControl = ({dataMap, handleChange, validateDataType}) => 
    {
        return (
            <div className="row m-2 p-2">
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1" >
                Are written work instructions available at work stations?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="writtenWorkInstructionsAvaibleInStation1" 
                        name="writtenWorkInstructionsAvaibleInStation" 
                        value="Yes" 
                        checked={dataMap.writtenWorkInstructionsAvaibleInStation === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="writtenWorkInstructionsAvaibleInStation1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="writtenWorkInstructionsAvaibleInStation2" 
                        name="writtenWorkInstructionsAvaibleInStation" 
                        value="No" 
                        checked={dataMap.writtenWorkInstructionsAvaibleInStation === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="writtenWorkInstructionsAvaibleInStation2">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1" >
                Does the finished product show evidence of final inspection acceptance?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="finalInspectionEvidence1" 
                        name="finalInspectionEvidence" 
                        value="Yes" 
                        checked={dataMap.finalInspectionEvidence === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="finalInspectionEvidence1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="finalInspectionEvidence2" 
                        name="finalInspectionEvidence" 
                        value="No" 
                        checked={dataMap.finalInspectionEvidence === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="finalInspectionEvidence2">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1">
                Are statistical methods used to control the process?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="statisMethod1" 
                        name="statisMethod" 
                        value="Yes" 
                        checked={dataMap.statisMethod === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="statisMethod1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="statisMethod2" 
                        name="statisMethod" 
                        value="No" 
                        checked={dataMap.statisMethod === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="statisMethod2">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1">
                Are procedures in place for control of customer-supplied documents?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="suppliedDocument1" 
                        name="suppliedDocument" 
                        value="Yes" 
                        checked={dataMap.suppliedDocument === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="suppliedDocument1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="suppliedDocument2" 
                        name="suppliedDocument" 
                        value="No" 
                        checked={dataMap.suppliedDocument === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="suppliedDocument2">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1">
                Does rage procedure include a method for handling revision changes & obsolete documents?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="includeMethod1" 
                        name="includeMethod" 
                        value="Yes" 
                        checked={dataMap.includeMethod === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="includeMethod1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="includeMethod2" 
                        name="includeMethod" 
                        value="No" 
                        checked={dataMap.includeMethod === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="includeMethod2">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1" >
                Are quality capabilities of suppliers evaluated prior to procurement?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="qualityCapabilities1" 
                        name="qualityCapabilities" 
                        value="Yes" 
                        checked={dataMap.qualityCapabilities === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="qualityCapabilities1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="qualityCapabilities2" 
                        name="qualityCapabilities" 
                        value="No" 
                        checked={dataMap.qualityCapabilities === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="qualityCapabilities2">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
                
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1" >
                Do you have an approved supplier list?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="approvedSupplierList1" 
                        name="approvedSupplierList" 
                        value="Yes" 
                        checked={dataMap.approvedSupplierList === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="approvedSupplierList1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="approvedSupplierList2" 
                        name="approvedSupplierList" 
                        value="No" 
                        checked={dataMap.approvedSupplierList === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="approvedSupplierList2">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1">
                Is the supplier competent with respect to market price ?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="marketPrice1" 
                        name="marketPrice" 
                        value="Yes" 
                        checked={dataMap.marketPrice === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="marketPrice1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="marketPrice2" 
                        name="marketPrice" 
                        value="No" 
                        checked={dataMap.marketPrice === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="marketPrice2">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
    
                <div className="col-md-12">
                <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1">
                Are certified test reports & certifications of conformance obtained on purchased material ?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="certifiedTestReports1" 
                        name="certifiedTestReports" 
                        value="Yes" 
                        checked={dataMap.certifiedTestReports === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="certifiedTestReports1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="certifiedTestReports2" 
                        name="certifiedTestReports" 
                        value="No" 
                        checked={dataMap.certifiedTestReports === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="certifiedTestReports2">No</label>
                </div>
            </div>
        </div>
    </div>
    
    <div className="row">
        <div className="col-md-12 d-flex">
            <label className="col-form-label col-md-6 px-2 py-1">
                Is the supplier capable of on-time delivery ?
                <span 
                    className="text-danger mx-1" 
                    style={{fontSize : '17px'}}>*
                </span>
            </label>
            <div className="d-flex">
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="supplierOnTimeDelivery1" 
                        name="supplierOnTimeDelivery" 
                        value="Yes" 
                        checked={dataMap.supplierOnTimeDelivery === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="supplierOnTimeDelivery1">Yes</label>
                </div>
    
                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="supplierOnTimeDelivery2" 
                        name="supplierOnTimeDelivery" 
                        value="No" 
                        checked={dataMap.supplierOnTimeDelivery === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="supplierOnTimeDelivery2">No</label>
                </div>
            </div>
        </div>
    </div>
    
                </div>
            </div>
        )
    }
    
    export default DocAndProcControl