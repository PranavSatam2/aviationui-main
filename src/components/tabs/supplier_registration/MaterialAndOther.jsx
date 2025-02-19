

const MaterialAndOther = ({dataMap, handleChange, validateDataType, actionPerformed}) => 
    {
        return (
            <div className="row m-2 p-2 mt-4">
                <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="processDocumented">Are Equipment calibrated <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="equipCalibrated1" name="equipCalibrated" value={dataMap.equipCalibrated} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="equipCalibrated1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="equipCalibrated2" name="equipCalibrated" value={dataMap.equipCalibrated} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="equipCalibrated2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="equipCalibrated3" name="equipCalibrated" value={dataMap.equipCalibrated} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="equipCalibrated3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Are Gauges, test equipment periodically certified & are records maintained for frequency of recalibration <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="recalibration1" name="recalibration" value={dataMap.recalibration} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="recalibration1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="recalibration2" name="recalibration" value={dataMap.recalibration} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="recalibration2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="recalibration3" name="recalibration" value={dataMap.recalibration} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="recalibration3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Are gauges, test equipment's available, sufficient for our scope of work <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="scopeOfWork1" name="scopeOfWork" value={dataMap.scopeOfWork} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="scopeOfWork1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="scopeOfWork2" name="scopeOfWork" value={dataMap.scopeOfWork} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="scopeOfWork2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="scopeOfWork3" name="scopeOfWork" value={dataMap.scopeOfWork} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="scopeOfWork3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Is there Adequate area & safety programs in place <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="safetyProgram1" name="safetyProgram" value={dataMap.safetyProgram} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="safetyProgram1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="safetyProgram2" name="safetyProgram" value={dataMap.safetyProgram} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="safetyProgram2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="safetyProgram3" name="safetyProgram" value={dataMap.safetyProgram} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="safetyProgram3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12 d-flex">
                        <label className="col-form-label col-md-7" htmlFor="isoRegistered">Is there procedure in place for house keeping <span className="text-danger mx-1 " style={{fontSize : '17px'}}>*</span></label>
                        <div className="d-flex">
                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="houseKeeping1" name="houseKeeping" value={dataMap.houseKeeping} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="houseKeeping1" value="Y">Yes</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="houseKeeping2" name="houseKeeping" value={dataMap.houseKeeping} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="houseKeeping2" value="N">No</label>
                            </div>

                            <div className="form-check mx-3 p-0">
                                <input className="form-check-input" type="radio" id="houseKeeping3" name="houseKeeping" value={dataMap.houseKeeping} onChange={handleChange}/>
                                <label className="form-check-label pt-1" htmlFor="houseKeeping3" value="NA">NA</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 text-right align-items-end">
                <button type="button" className="btn btn-primary" onClick={actionPerformed}>Submit</button>
            </div>
        </div>
        )
    }
    
export default MaterialAndOther