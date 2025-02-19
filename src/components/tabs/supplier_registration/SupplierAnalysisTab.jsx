const SupplierAnalysisTab = ({dataMap, handleChange, validateDataType}) => {
    return (
        <div className="row m-2 p-2">
            <div className="col-md-12 d-flex align-items-center mb-3">
                <label className="col-md-3 col-form-label" htmlFor="coreProcess">What are your core product/process <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                <input className="form-control col-md-9" type="text" id="coreProcess" name="coreProcess" value={dataMap.coreProcess} onChange={handleChange} onInput={() => validateDataType('coreProcess', 'A')}/>
            </div>

            <div className="col-md-12 d-flex align-items-center mb-3">
                <label className="col-md-3 col-form-label" htmlFor="workYear">How long have you been in this business doing this type of work</label>
                <input className="form-control col-md-9" type="text" id="workYear" name="workYear" />
            </div>

            <div className="col-md-12 mb-3">
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are you ISO Registered <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="isoRegistered1" name="isoRegistered" value={dataMap.isoRegistered} onChange={handleChange} onInput={() => validateDataType('coreProcess', 'A')}/>
                                <label className="form-check-label pt-1" htmlFor="isoRegisteredYes" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="isoRegistered2" name="isoRegistered"  value={dataMap.isoRegistered} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="isoRegisteredNo" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="isoRegistered3" name="isoRegistered"  value={dataMap.isoRegistered} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="isoRegistered3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-3">
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">ISO Registered <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="dontKnow1" name="dontKnow"  value={dataMap.dontKnow} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="dontKnow1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0"> 
                                <input className="form-check-input" type="radio" id="dontKnow2" name="dontKnow" value={dataMap.dontKnow} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="dontKnow2" value="N">No</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoStandard">ISO Standard</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="isoStandard1" name="isoStandard" value={dataMap.isoStandard} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="isoStandard1"value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="isoStandard2" name="isoStandard" value={dataMap.isoStandard} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="isoStandard2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="isoStandard3" name="isoStandard" value={dataMap.isoStandard} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="isoStandard3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-1">
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Having CAR 145/DGCA Approval <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="carApprovalYes" name="carApproval" value={dataMap.carApproval} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="carApprovalYes"value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="carApprovalNo" name="carApproval" value={dataMap.carApproval} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="carApprovalNo" value="N">No</label>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex">
                        <label className="col-md-7 col-form-label" htmlFor="registerCar">If not registered.Do you have plans to do so and when </label>
                        <input className="form-control col-md-5" type="text" id="registerCar" name="registerCar" value={dataMap.registerCar} onChange={handleChange}/>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-1">
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="numEmp">Total number of employee's </label>
                        <input className="form-control col-md-6" type="number" id="numEmp" name="numEmp" value={dataMap.numEmp} onChange={handleChange}/>
                    </div>

                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="numOpeShift">Number of operating shift's </label>
                        <input className="form-control col-md-6" type="number" id="numOpeShift" name="numOpeShift" value={dataMap.numOpeShift} onChange={handleChange}/>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mb-1">
                <div className="row">
                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="numEmp">Do you have current quality manual's <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="quaManualYes" name="quaManual" value={dataMap.quaManual} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="quaManualYes"value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="quaManualNo" name="quaManual" value={dataMap.quaManual} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="quaManualNo" value="N">No</label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-6 d-flex">
                        <label className="col-md-6 col-form-label" htmlFor="turnOver">Annual turnover <span className="text-danger mx-1 pt-3" style={{fontSize : '17px'}}>*</span></label>
                        <input className="form-control col-md-6" type="number" id="turnOver" name="turnOver" value={dataMap.turnOver} onChange={handleChange}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierAnalysisTab;
