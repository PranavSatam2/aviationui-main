
const IncomingInspectionTab = ({dataMap, handleChange, validateDataType}) =>
    {
        return (
        <div className="row m-2 p-2 mt-4">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="processDocumented">is incoming process documented</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="processDocumented1" name="processDocumented" value={dataMap.processDocumented} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="processDocumented1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="processDocumented2" name="processDocumented" value={dataMap.processDocumented} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="processDocumented2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">What sampling plan is used for incoming inspection</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="samplingIncomingInsp1" name="samplingIncomingInsp" value={dataMap.samplingIncomingInsp} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="samplingIncomingInsp1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="samplingIncomingInsp2" name="samplingIncomingInsp" value={dataMap.samplingIncomingInsp} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="samplingIncomingInsp2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Is Objective evidence of receiving inspection results maintained in file</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="objectiveEvidence1" name="objectiveEvidence" value={dataMap.objectiveEvidence} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="objectiveEvidence1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="objectiveEvidence2" name="objectiveEvidence" value={dataMap.objectiveEvidence} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="objectiveEvidence2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">is not number or other traceability identification maintained</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="identificationMaintained1" name="identificationMaintained" value={dataMap.identificationMaintained} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="identificationMaintained1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="identificationMaintained2" name="identificationMaintained" value={dataMap.identificationMaintained} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="identificationMaintained2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">is incoming material kept separate from inspected material</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="sepInsMaterial1" name="sepInsMaterial" value={dataMap.sepInsMaterial} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="sepInsMaterial1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="sepInsMaterial2" name="sepInsMaterial" value={dataMap.sepInsMaterial} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="sepInsMaterial2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">is there any procedure for isolating nonconforming material</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="nonConMaterial1" name="nonConMaterial" value={dataMap.nonConMaterial} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="nonConMaterial1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="nonConMaterial2" name="nonConMaterial" value={dataMap.nonConMaterial} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="nonConMaterial2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-6" htmlFor="isoRegistered">Are deviation that affect the customer's requirement referred to customers for disposition</label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="affectCusReq1" name="affectCusReq" value={dataMap.affectCusReq} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="affectCusReq1" value="True">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="affectCusReq2" name="affectCusReq" value={dataMap.affectCusReq} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="affectCusReq2" value="False">No</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
    
    export default IncomingInspectionTab