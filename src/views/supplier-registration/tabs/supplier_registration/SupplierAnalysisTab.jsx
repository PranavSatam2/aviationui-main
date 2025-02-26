const SupplierAnalysisTab = ({dataMap, handleChange, validateDataType, validateLen}) => {
    return (
        <div className="row m-2 p-2">
            <div className="col-md-12 d-flex align-items-center mb-3">
                <label className="col-md-3 col-form-label" htmlFor="coreProcess">What are your core product/process
                    <span 
                        className="text-danger mx-1" 
                        style={{fontSize : '17px'}}>*
                    </span></label>
                <input className="form-control col-md-9" 
                type="text" 
                id="coreProcess" 
                name="coreProcess" 
                value={dataMap.coreProcess} 
                onChange={handleChange} 
                onInput={(event) => { validateDataType(event, 'ANS'); validateLen(event, 0, 500); }} />
            </div>

            <div className="col-md-12 d-flex align-items-center mb-3">
                <label className="col-md-3 col-form-label" htmlFor="workYear">How long have you been in this business doing this type of work</label>
                <input className="form-control col-md-9" 
                type="text" 
                id="workYear" 
                name="workYear"
                value={dataMap.workYear} onChange={handleChange}
                onInput={(event) => { validateDataType(event, 'ANS'); validateLen(event, 0, 500); }} />
            </div>
            <div className="col-md-12 mb-3">
    <div className="row">
        <div className="col-md-6 d-flex">
            <label className="col-form-label col-md-6">Are you ISO Registered
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
                        id="areYouIsoRegistered1"  
                        name="areYouIsoRegistered" 
                        value="Yes" 
                        checked={dataMap.areYouIsoRegistered === "Yes"}
                        onChange={handleChange} 
                    />
                    <label className="form-check-label pt-1" htmlFor="areYouIsoRegistered1">Yes</label>
                </div>

                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="areYouIsoRegistered2"  
                        name="areYouIsoRegistered" 
                        value="No"  
                        checked={dataMap.areYouIsoRegistered === "No"}
                        onChange={handleChange} 
                    />
                    <label className="form-check-label pt-1" htmlFor="areYouIsoRegistered2">No</label>
                </div>
            </div>
        </div>
    </div>
</div>
<div className="col-md-12 mb-3">
    <div className="row">
        {/* ISO Registered Section */}
        <div className="col-md-6 d-flex">
            <label className="col-form-label col-md-6">ISO Registered
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
                        id="isoRegistered1" 
                        name="isoRegistered" 
                        value="Yes" 
                        checked={dataMap.isoRegistered === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="isoRegistered1">Yes</label>
                </div>

                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="isoRegistered2"  
                        name="isoRegistered" 
                        value="No"  
                        checked={dataMap.isoRegistered === "No"}  
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="isoRegistered2">No</label>
                </div>
            </div>
        </div>

        {/* ISO Standard Section */}
        <div className="col-md-6 d-flex">
            <label className="col-form-label col-md-6">ISO Standard
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
                        id="isoStandard1"  
                        name="isoStandard" 
                        value="Yes" 
                        checked={dataMap.isoStandard === "Yes"}  
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="isoStandard1">Yes</label>
                </div>

                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="isoStandard2" 
                        name="isoStandard" 
                        value="No" 
                        checked={dataMap.isoStandard === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="isoStandard2">No</label>
                </div>
            </div>
        </div>
    </div>
</div>

<div className="col-md-12 mb-1">
    <div className="row">
        {/* CAR 145/DGCA Approval Section */}
        <div className="col-md-6 d-flex">
            <label className="col-form-label col-md-6" >
                Having CAR 145/DGCA Approval
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
                        id="carDgcaApprovalYes" 
                        name="carDgcaApproval" 
                        value="Yes" 
                        checked={dataMap.carDgcaApproval === "Yes"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="carDgcaApprovalYes">Yes</label>
                </div>

                <div className="form-check mx-3 p-0">
                    <input 
                        className="form-check-input" 
                        type="radio" 
                        id="carDgcaApprovalNo" 
                        name="carDgcaApproval"
                        value="No" 
                        checked={dataMap.carDgcaApproval === "No"} 
                        onChange={handleChange}
                    />
                    <label className="form-check-label pt-1" htmlFor="carDgcaApprovalNo">No</label>
                </div>
            </div>
        </div>

        {/* Registration Plans Section */}
        <div className="col-md-6 d-flex">
            <label className="col-md-7 col-form-label" htmlFor="isoRegistrationPlans">
                If not registered, do you have plans to do so and when?
            </label>
            <input 
                className="form-control col-md-5" 
                type="text" 
                id="isoRegistrationPlans" 
                name="isoRegistrationPlans"  
                value={dataMap.isoRegistrationPlans} 
                onChange={handleChange}
                onInput={(event) => { validateDataType(event, 'ANS'); validateLen(event, 1, 50); }}
            />
        </div>
    </div>
</div>


            <div className="col-md-12 mb-1">
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="numEmp">Total number of employee's </label>
                        <input className="form-control col-md-6" 
                        type="number" 
                        id="numEmp" 
                        name="numEmp" 
                        value={dataMap.numEmp} onChange={handleChange}
                        onInput={(event) => { validateDataType(event, 'N'); validateLen(event, 0, 4); }} />
                    </div>

                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="numOpeShift">Number of operating shift's </label>
                        <input className="form-control col-md-6" 
                        type="number" 
                        id="numOpeShift"
                         name="numOpeShift" 
                         value={dataMap.numOpeShift} onChange={handleChange}
                         onInput={(event) => { validateDataType(event, 'N'); validateLen(event, 0, 3); }} />
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-1">
                <div className="row">
                <div className="col-md-6 d-flex">
        <label className="col-md-6 col-form-label" htmlFor="quaManual">
            Do you have current quality manuals?
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
                    id="quaManualYes" 
                    name="quaManual"  
                    value="Yes" 
                    checked={dataMap.quaManual === "Yes"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="quaManualYes">Yes</label>
            </div>

            <div className="form-check mx-3 p-0">
                <input 
                    className="form-check-input" 
                    type="radio" 
                    id="quaManualNo" 
                    name="quaManual"  
                    value="No" 
                    checked={dataMap.quaManual === "No"} 
                    onChange={handleChange}
                />
                <label className="form-check-label pt-1" htmlFor="quaManualNo">No</label>
            </div>
        </div>
    </div>
                    
                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="turnOver">Annual turnover 
                            <span 
                                className="text-danger mx-1" 
                                style={{fontSize : '17px'}}>*
                            </span>
                        </label>
                        <input className="form-control col-md-6" 
                        type="number" 
                        id="turnOver" 
                        name="turnOver" 
                        value={dataMap.turnOver} onChange={handleChange}
                        onInput={(event) => { validateDataType(event, 'N'); validateLen(event, 0, 10); }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierAnalysisTab;
